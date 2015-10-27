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
    assert.equal(find(log.modules, {src: 'import.less'}).destHash, 'c6a3da5195aa54ab38162649d5ee3b94');
  });

  it('处理URL', function() {
    assert.equal(find(log.modules, {src: 'foz/url.less'}).destHash, 'dc8aac6e65fe6779f66a1ecdc678958f');
  });
});
