var isUrl = require('is-url-superb');
var pathIsAbsolute = require('path-is-absolute');

var Node = require('./node');

module.exports = function (less) {
  function Visitor() {
    this.__visitor__ = new less.visitors.Visitor(this);
  }

  Visitor.prototype = {
    isReplacing: true,
    isPreEvalVisitor: true,
    run: function (root) {
      return this.__visitor__.visit(root);
    },
    visitRule: function (ruleNode, visitArgs) {
      this.__inRule__ = true;
      return ruleNode;
    },
    visitRuleOut: function (ruleNode, visitArgs) {
      this.__inRule__ = false;
    },
    visitUrl: function (URLNode, visitArgs) {
      if (!this.__inRule__ || isUrl(URLNode.value.value) || pathIsAbsolute(URLNode.value.value)) {
        return URLNode;
      }

      return new less.tree.Call('miaow', [new Node(URLNode.value)], URLNode.index || 0, URLNode.currentFileInfo);
    }
  };

  return Visitor;
};
