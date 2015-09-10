var find = require('lodash.find');
var mutil = require('miaow-util');
var path = require('path');
var postcss = require('postcss');
var Promise = require('promise');

function generateUrl(css, module) {
  try {
    var root = postcss.parse(css, {from: module.srcAbsPath});
  } catch (err) {
    return Promise.reject(err);
  }

  var decls = [];
  var infos = [];
  var reg = /miaow\(['"]?(.*?)['"]?\)/g;
  root.eachDecl(function (decl) {
    if (decl.value && reg.test(decl.value)) {
      var value = decl.value;
      
      decls.push(decl);
      
      reg.lastIndex = 0;
      var searchResult;
      while((searchResult = reg.exec(value))) {
        infos.push(JSON.parse(searchResult[1]));
      }
    }
  });
  
  return Promise.all(infos.map(function (info) {
    return new Promise(function (resolve, reject) {
      var relativeInfo = /^([^?#]+)([?#].*)?$/.exec(info.value);

      module.getModule({
        relative: relativeInfo[1],
        basedir: path.dirname(info.filename || module.srcAbsPath)
      }, function (err, relativeModule) {
        if (err) {
          return reject(err);
        }

        info.result = relativeModule.url || mutil.relative(path.dirname(module.destAbsPath), relativeModule.destAbsPath);
        info.result += relativeInfo[2] || '';

        return resolve();
      });
    });
  })).then(function () {
    decls.forEach(function (decl) {
      reg.lastIndex = 0;
      decl.value = decl.value.replace(reg, function (str, infoStr) {
        var info = JSON.parse(infoStr);

        return 'url('+ find(infos, function (item) {
          return info.value === item.value && info.filename === item.filename;
        }).result +')';
      });
    });
    
    return root.toResult().css;
  });
}

module.exports = generateUrl;
