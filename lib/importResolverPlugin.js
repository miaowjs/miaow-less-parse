var fs = require('fs');
var path = require('path');

function getImportResolver(less) {
  var FileManager = less.FileManager;

  function ImportResolver(context) {
    this.__context__ = context;
  }

  ImportResolver.prototype = new FileManager();

  ImportResolver.prototype.supportsSync = function(filename, currentDirectory, options, environment) {
    return false;
  };

  ImportResolver.prototype.loadFile = function(filename, currentDirectory, options, environment, callback) {
    var context = this.__context__;

    context.resolveModule(filename, {
      basedir: currentDirectory,
      extensions: ['.less', '.css']
    }, function(err, module) {
      if (err) {
        return callback(err);
      }

      var absPath = path.resolve(context.context, module.src);

      callback(null, {
        contents: fs.readFileSync(absPath, {encoding: 'utf8'}),
        filename: absPath
      });
    });
  };

  ImportResolver.prototype.tryAppendExtension = function(path, ext) {
    return path;
  };

  ImportResolver.prototype.tryAppendLessExtension = function(path) {
    return path;
  };

  return ImportResolver;
}

function ImportResolverPlugin(context) {
  this.__context__ = context;
}

ImportResolverPlugin.prototype.install = function(less, pluginManager) {
  var ImportResolver = getImportResolver(less);
  pluginManager.addFileManager(new ImportResolver(this.__context__));
};

module.exports = ImportResolverPlugin;
