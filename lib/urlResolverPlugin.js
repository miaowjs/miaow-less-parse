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
      URLNode.isEvald = true;
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
