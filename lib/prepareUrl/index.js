module.exports = {
  install: function(less, pluginManager) {
    var Visitor = require('./visitor')(less);
    pluginManager.addVisitor(new Visitor());
  }
};
