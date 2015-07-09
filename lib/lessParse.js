var less = require('less');
var mutil = require('miaow-util');
var path = require('path');

module.exports = function (option, cb) {
  var module = this;
  less.render(
    this.contents.toString(),
    {
      paths: [path.dirname(module.srcAbsPath)]
    },
    function (err, output) {
      if (err) {
        return cb(err);
      }

      module.contents = new Buffer(output.css);
      cb();
    }
  );
};
