function Node(subNode, currentFileInfo) {
  this.value = subNode;
  this.__currentFileInfo__ = currentFileInfo;
}

Node.prototype.accept = function(visitor) {
  this.value = visitor.visit(this.value);
};

Node.prototype.eval = function(context) {
  var quoted = this.value.eval(context);

  if (quoted.quote) {
    quoted.quote = '\'';
  }

  quoted.value = JSON.stringify({
    value: quoted.value,
    filename: this.__currentFileInfo__.filename
  });

  return quoted;
};

module.exports = Node;
