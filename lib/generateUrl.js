var find = require('lodash.find');
var path = require('path');
var postcss = require('postcss');
var Promise = require('promise');

function generateUrl(css, context) {
  var root;
  var srcAbsPath = path.resolve(context.context, context.src);

  try {
    root = postcss.parse(css, {from: srcAbsPath});
  } catch (err) {
    return Promise.reject(err);
  }

  var decls = [];
  var infos = [];
  var reg = /miaow\(['"]?(.*?)['"]?\)/g;

  root.walkDecls(function(decl) {
    if (decl.value && reg.test(decl.value)) {
      var value = decl.value;

      decls.push(decl);

      reg.lastIndex = 0;
      var searchResult = reg.exec(value);
      while (searchResult) {
        infos.push(JSON.parse(searchResult[1]));
        searchResult = reg.exec(value);
      }
    }
  });

  return Promise.all(infos.map(function(info) {
    return new Promise(function(resolve, reject) {
      var relativeInfo = /^([^?#]+)([?#].*)?$/.exec(info.value);

      context.resolveModule(relativeInfo[1], {
        basedir: path.dirname(info.filename || srcAbsPath)
      }, function(err, module) {
        if (err) {
          return reject(err);
        }

        context.addFileDependency(module.src);

        info.result = module.url;
        info.result += relativeInfo[2] || '';

        return resolve();
      });
    });
  })).then(function() {
    decls.forEach(function(decl) {
      reg.lastIndex = 0;
      decl.value = decl.value.replace(reg, function(str, infoStr) {
        var info = JSON.parse(infoStr);
        var result = find(infos, function(item) {
          return info.value === item.value && info.filename === item.filename;
        }).result;

        return 'url(' + result + ')';
      });
    });

    return root.toResult().css;
  });
}

module.exports = generateUrl;