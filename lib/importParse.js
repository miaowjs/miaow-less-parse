var _ = require('lodash');
var mutil = require('miaow-util');
var path = require('path');

module.exports = function (option, cb) {
  var reg = /@import\s*[^'"]*\s*['"]([^'"]+)['"]/g;
  var contents = this.contents.toString();

  var basedir = path.dirname(this.srcAbsPath);
  var resolveOptions = _.extend(
    {},
    this.options.resolve,
    {
      extensions: ['.less']
    }
  );

  var cwd = this.cwd;
  var module = this;
  contents = contents.replace(reg, function (str, relativePath) {
    var resolvedPath = mutil.resolve(relativePath, basedir, resolveOptions);

    // 添加依赖信息
    module.dependencies.push(path.relative(cwd, resolvedPath));

    resolvedPath = path.relative(basedir, resolvedPath).split(path.sep).join('/');

    return str.replace(
      new RegExp('[\'"]' + relativePath + '[\'"]'),
      '"' + resolvedPath + '"'
    );
  });

  this.contents = new Buffer(contents);
  cb();
};
