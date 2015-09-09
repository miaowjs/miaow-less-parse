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
  var reg = /miaow\(['"]?(.*?)['"]?\)/;
  root.eachDecl(function (decl) {
    if (decl.value && reg.test(decl.value)) {
      decls.push(decl);
    }
  });

  return Promise.all(decls.map(function (decl) {
    return new Promise(function (resolve, reject) {
      var info = JSON.parse(reg.exec(decl.value)[1]);

      var relativeInfo = /^([^?#]+)([?#].*)?$/.exec(info.value);

      module.getModule({
        relative: relativeInfo[1],
        basedir: path.dirname(info.filename || module.srcAbsPath)
      }, function (err, relativeModule) {
        if (err) {
          console.log(info);
          return reject(err);
        }

        var url = relativeModule.url || mutil.relative(path.dirname(module.destAbsPath), relativeModule.destAbsPath);
        url += relativeInfo[2] || '';

        decl.value = decl.value.replace(reg, 'url(' + url + ')');

        return resolve();
      });
    });
  })).then(function () {
    return root.toResult().css;
  });
}

module.exports = generateUrl;
