var find = require('lodash.find');
var assert = require('assert');
var fs = require('fs');
var miaow = require('miaow');
var path = require('path');

var parse = require('../index');
describe('miaow-less-parse', function() {
  this.timeout(10e3);

  var log;

  function doCompile(done) {
    miaow({
      context: path.resolve(__dirname, './fixtures')
    }, function(err) {
      if (err) {
        console.error(err.toString(), err.stack);
        process.exit(1);
      }

      log = JSON.parse(fs.readFileSync(path.resolve(__dirname, './output/miaow.log.json')));
      done();
    });
  }

  before(doCompile);

  it('接口是否存在', function() {
    assert(!!parse);
  });

  it('导入', function() {
    assert.equal(find(log.modules, {src: 'import.less'}).destHash, 'f3f34f77481a3200bbc416f430550884');
  });

  it('处理URL', function() {
    assert.equal(find(log.modules, {src: 'foz/url.less'}).destHash, 'b869e4286b9e491874d914edb03ea022');
  });
});
