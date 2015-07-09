var async = require('async');

var importParse = require('./lib/importParse');
var lessParse = require('./lib/lessParse');

module.exports = function (option, cb) {
  async.series([
    importParse.bind(this, option),
    lessParse.bind(this, option)
  ], cb);
};
