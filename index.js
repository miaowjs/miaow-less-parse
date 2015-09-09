var less = require('less');
var mutil = require('miaow-util');

var ImportResolverPlugin = require('./lib/importResolverPlugin');
var prepareUrl = require('./lib/prepareUrl');
var generateUrl = require('./lib/generateUrl');
var pkg = require('./package.json');

module.exports = mutil.plugin(pkg.name, pkg.version, function (option, cb) {
  var module = this;
  less.render(
    this.contents.toString(),
    {
      filename: this.srcAbsPath,
      relativeUrls: true,
      plugins: [new ImportResolverPlugin(module, cb), prepareUrl]
    },
    function (err, result) {
      if (err) {
        return cb(err);
      }

      generateUrl(result.css, module)
        .then(function (content) {
          module.contents = new Buffer(content);
          return cb();
        }, function (err) {
          return cb(err);
        });
    }
  );
});
