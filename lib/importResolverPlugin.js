var Q = require('q');

function getImportResolver(less) {
  var FileManager = less.FileManager;

  function ImportResolver(module) {
    this.module = module;
  }

  ImportResolver.prototype = new FileManager();

  ImportResolver.prototype.supportsSync = function (filename, currentDirectory, options, environment) {
    return false;
  };

  ImportResolver.prototype.loadFile = function (filename, currentDirectory, options, environment) {
    var module = this.module;
    return Q.Promise(function (fullfill, reject) {
      module.getModule({
        relative: filename,
        basedir: currentDirectory,
        resolve: {
          extensions: ['.less']
        }
      }, function (err, relativeModule) {
        if (err) {
          reject(err);
          return;
        }

        FileManager.prototype.loadFile.call(
          new ImportResolver(relativeModule),
          relativeModule.srcAbsPath,
          "",
          options,
          environment
        ).then(fullfill, reject);
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

function ImportResolverPlugin(module) {
  this.module = module;
}

ImportResolverPlugin.prototype.install = function (less, pluginManager) {
  var ImportResolver = getImportResolver(less);
  pluginManager.addFileManager(new ImportResolver(this.module));
};

module.exports = ImportResolverPlugin;
