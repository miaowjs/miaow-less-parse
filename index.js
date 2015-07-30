var less = require('less');
var mutil = require('miaow-util');
var path = require('path');

var ImportResolverPlugin = require('./lib/importResolverPlugin');
var UrlResolverPlugin = require('./lib/urlResolverPlugin');
var pkg = require('./package.json');

module.exports = mutil.plugin(pkg.name, pkg.version, function (option, cb) {
  var module = this;
  less.render(
    this.contents.toString(),
    {
      filename: this.srcAbsPath,
      paths: [path.dirname(module.srcAbsPath)],
      relativeUrls: true,
      plugins: [new ImportResolverPlugin(module), new UrlResolverPlugin(module)]
    },
    function (err, output) {
      if (err) {
        return cb(err);
      }

      module.contents = new Buffer(output.css);
      cb();
    }
  );
});
