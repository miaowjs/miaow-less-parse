var fs = require('fs');
var path = require('path');

function getImportResolver(less) {
  var FileManager = less.FileManager;

  function ImportResolver(context, rootCallback) {
    this.__context__ = context;
    this.__rootCallback__ = rootCallback;
  }

  ImportResolver.prototype = new FileManager();

  ImportResolver.prototype.supportsSync = function(filename, currentDirectory, options, environment) {
    return false;
  };

  ImportResolver.prototype.loadFile = function(filename, currentDirectory, options, environment, callback) {
    var context = this.__context__;
    var rootCallback = this.__rootCallback__;

    context.resolveFile(filename, {
      basedir: currentDirectory,
      extensions: ['', '.less']
    }, function(err, file) {
      if (err) {
        return rootCallback(err);
      }

      context.addFileDependency(file);
      file = path.resolve(context.context, file);

      callback(null, {
        contents: fs.readFileSync(file, {encoding: 'utf8'}),
        filename: file
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

function ImportResolverPlugin(context, rootCallback) {
  this.__context__ = context;
  this.__rootCallback__ = rootCallback;
}

ImportResolverPlugin.prototype.install = function(less, pluginManager) {
  var ImportResolver = getImportResolver(less);
  pluginManager.addFileManager(new ImportResolver(this.__context__, this.__rootCallback__));
};

module.exports = ImportResolverPlugin;
