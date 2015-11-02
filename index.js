var less = require('less');
var path = require('path');

var ImportResolverPlugin = require('./lib/importResolverPlugin');
var prepareUrl = require('./lib/prepareUrl');
var generateUrl = require('./lib/generateUrl');
var pkg = require('./package.json');

module.exports = function(options, callback) {
  var context = this;

  less.render(
    context.contents.toString(),
    {
      filename: path.resolve(context.context, context.src),
      relativeUrls: true,
      plugins: [new ImportResolverPlugin(context), prepareUrl]
    },
    function(err, result) {
      if (err) {
        return callback(err);
      }

      generateUrl(result.css, context)
        .then(function(content) {
          context.contents = new Buffer(content);
          return callback();
        },

        callback);
    }
  );
};

module.exports.toString = function() {
  return [pkg.name, pkg.version].join('@');
};
