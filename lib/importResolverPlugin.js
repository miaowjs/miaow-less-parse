var fs = require('fs');

function getImportResolver(less) {
  var FileManager = less.FileManager;

  function ImportResolver(module, rootCallback) {
    this.__module__ = module;
    this.__rootCallback__ = rootCallback;
  }

  ImportResolver.prototype = new FileManager();

  ImportResolver.prototype.supportsSync = function (filename, currentDirectory, options, environment) {
    return false;
  };

  ImportResolver.prototype.loadFile = function (filename, currentDirectory, options, environment, cb) {
    var module = this.__module__;
    var rootCallback = this.__rootCallback__;

    module.getModule({
      relative: filename,
      basedir: currentDirectory,
      resolve: {
        extensions: ['.less']
      }
    }, function (err, relativeModule) {
      if (err) {
        return rootCallback(err);
      }

      cb(null, {
        contents: fs.readFileSync(relativeModule.srcAbsPath, {encoding: 'utf8'}),
        filename: relativeModule.srcAbsPath
      });
    });
  };

  ImportResolver.prototype.tryAppendExtension = function (path, ext) {
    return path;
  };

  ImportResolver.prototype.tryAppendLessExtension = function (path) {
    return path;
  };

  return ImportResolver;
}

function ImportResolverPlugin(module, rootCallback) {
  this.__module__ = module;
  this.__rootCallback__ = rootCallback;
}

ImportResolverPlugin.prototype.install = function (less, pluginManager) {
  var ImportResolver = getImportResolver(less);
  pluginManager.addFileManager(new ImportResolver(this.__module__, this.__rootCallback__));
};

module.exports = ImportResolverPlugin;
