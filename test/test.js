var assert = require('assert');
var fs = require('fs');
var miaow = require('miaow');
var path = require('path');

var parse = require('../index');
describe('miaow-less-parse', function () {
  this.timeout(10000e3);

  var log;

  var cwd = path.resolve(__dirname, './fixtures');
  var output = path.resolve(__dirname, './output');

  function doCompile(cb) {
    miaow.compile({
      cwd: cwd,
      output: output,
      module: {
        tasks: [
          {
            test: /\.less$/,
            plugins: [parse]
          }
        ]
      }
    }, function (err) {
      if (err) {
        console.error(err.toString());
        throw err;
      }

      log = JSON.parse(fs.readFileSync(path.join(output, 'miaow.log.json')));
      cb();
    });
  }

  before(doCompile);

  it('接口是否存在', function () {
    assert(!!parse);
  });

  it('编译', function () {
    assert.equal(log.modules['foo.less'].hash, '4e6862c3c2f503068d2f800298a35cb3');
  });

  it('添加依赖信息', function () {
    assert.equal(log.modules['foo.less'].dependList[0], 'bar.less');
    assert.equal(log.modules['foo.less'].dependList[1], 'bower_components/foz/main.less');
  });
});
