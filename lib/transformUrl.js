var async = require('async');
var isUrl = require('is-url-superb');
var less = require('less');
var mutil = require('miaow-util');
var path = require('path');
var pathIsAbsolute = require('path-is-absolute');

module.exports = function (module, root, cb) {
  var urlNodes = [];

  var visitor = new less.visitors.Visitor({
    visitUrl: function (node) {
      var value = node.value.value;

      if (!value) {
        node.isEvald = true;
        return;
      }

      if (!isUrl(value) && !pathIsAbsolute(value) && !/^\s*data:/.test(value)) {
        urlNodes.push(node);
      }
    }
  });
  visitor.visit(root);

  async.waterfall([
    // 获取模块
    function (cb) {
      async.map(urlNodes, function (node, cb) {
        var filename = node.currentFileInfo.filename;

        if (filename === module.srcAbsPath) {
          return cb(null, {
            node: node,
            module: module
          });
        } else {
          var relative = mutil.relative(path.dirname(module.srcAbsPath), filename);
          relative = /^\./.test(relative) ? relative : ('./' + relative);
          module.getModule(relative, function (err, relativeModule) {
            cb(err, {
              node: node,
              module: relativeModule
            });
          });
        }
      }, cb);
    },
    function (urlNodeModules, cb) {
      async.each(urlNodeModules, function (nodeModule, cb) {
        var node = nodeModule.node;

        var urlInfo = /^([^?#]+)([?#].*)?$/.exec(node.value.value);

        nodeModule.module.getModule(urlInfo[1], function (err, relativeModule) {
          if (err) {
            return cb(err);
          }

          var url = mutil.relative(path.dirname(module.srcAbsPath), relativeModule.srcAbsPath);

          if (!/^\./.test(url)) {
            url = './' + url;
          }

          node.value.value = url + (urlInfo[2] || '');
          node.isEvald = true;
          cb();
        });
      }, cb);
    }
  ], cb);

};
