function Node(subNode) {
  this.value = subNode;
}

Node.prototype.accept = function (visitor) {
  this.value = visitor.visit(this.value);
};

Node.prototype.eval = function (context) {
  var quoted = this.value.eval(context);

  if (quoted.quote) {
    quoted.quote = '\'';
  }

  quoted.value = JSON.stringify({
    value: quoted.value,
    filename: quoted.currentFileInfo ? quoted.currentFileInfo.filename : ''
  });

  return quoted;
};

module.exports = Node;
