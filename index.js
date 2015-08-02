var less = require('less');
var mutil = require('miaow-util');

var ImportResolverPlugin = require('./lib/importResolverPlugin');
var transformUrl = require('./lib/transformUrl');
var pkg = require('./package.json');

module.exports = mutil.plugin(pkg.name, pkg.version, function (option, cb) {
  var module = this;
  less.parse(
    this.contents.toString(),
    {
      filename: this.srcAbsPath,
      relativeUrls: true,
      plugins: [new ImportResolverPlugin(module, cb)]
    },
    function (err, root, imports, options) {
      if (err) {
        return cb(err);
      }

      transformUrl(module, root, function (err) {
        if (err) {
          return cb(err);
        }

        try {
          var parseTree = new less.ParseTree(root, imports);
          var result = parseTree.toCSS(options);
          module.contents = new Buffer(result.css);
          cb();
        } catch (err) {
          cb(err);
        }
      });
    }
  );
})
;
