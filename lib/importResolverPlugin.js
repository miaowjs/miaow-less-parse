var Q = require('q');

function getImportResolver(less) {
  var FileManager = less.FileManager;

  function ImportResolver(options) {
    this.module = options.module;
  }

  ImportResolver.prototype = new FileManager();

  ImportResolver.prototype.supportsSync = function (filename, currentDirectory, options, environment) {
    return false;
  };

  ImportResolver.prototype.loadFile = function (filename, currentDirectory, options, environment) {
    var module = this.module;
    return Q.Promise(function (fullfill, reject) {
      module.getModule(filename, function (err, relativeModule) {
        if (err) {
          reject(err);
          return;
        }

        module.dependencies.push(relativeModule.srcPath);
        fullfill({contents: relativeModule.contents.toString(), filename: relativeModule.srcAbsPath});
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

function ImportResolverPlugin(options) {
  this.options = options || {};
}

ImportResolverPlugin.prototype.install = function (less, pluginManager) {
  var ImportResolver = getImportResolver(less);
  pluginManager.addFileManager(new ImportResolver(this.options));
};

module.exports = ImportResolverPlugin;