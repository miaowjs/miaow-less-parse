var async = require('async');
var mutil = require('miaow-util');

var importParse = require('./lib/importParse');
var lessParse = require('./lib/lessParse');

var pkg = require('./package.json');

module.exports = mutil.plugin(pkg.name, pkg.version, function (option, cb) {
  async.series([
    importParse.bind(this, option),
    lessParse.bind(this, option)
  ], cb);
});
