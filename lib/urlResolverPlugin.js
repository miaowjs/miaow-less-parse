var isUrl = require('is-url-superb');
var pathIsAbsolute = require('path-is-absolute');

function getUrlResolver(less) {

  function UrlResolver(module) {
    this.module = module;
    this._visitor = new less.visitors.Visitor(this);
  }

  UrlResolver.prototype = {
    isReplacing: true,
    isPreEvalVisitor: true,
    run: function (root) {
      return this._visitor.visit(root);
    },
    visitUrl: function (URLNode, visitArgs) {
      var __eval__ = URLNode.eval;
      URLNode.eval = function () {
        var node = __eval__.apply(URLNode, arguments);
        var value = node.value.value;
        if (!isUrl(value) && !pathIsAbsolute(value) && !/^\.[\.]\/]/.test(value)) {
          node.value.value = './' + value;
        }

        return node;
      };

      return URLNode;
    }
  };
  return UrlResolver;
}

function UrlResolverPlugin(module) {
  this.module = module;
}

UrlResolverPlugin.prototype.install = function (less, pluginManager) {
  var UrlResolver = getUrlResolver(less);
  pluginManager.addVisitor(new UrlResolver(this.module));
};

module.exports = UrlResolverPlugin;
