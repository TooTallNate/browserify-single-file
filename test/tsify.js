
/**
 * Module dependencies.
 */

var path = require('path');
var assert = require('assert');
var tsify = require('tsify');
var toArray = require('stream-to-array');
var BrowserifySingleFile = require('../');

describe('tsify', function () {

  it('should compile TypeScript to JavaScript', function (done) {
    this.test.timeout(10000);
    this.test.slow(8000);

    var filename = path.resolve(__dirname, 'fixtures', 'foo-class.ts');
    var bsf = new BrowserifySingleFile(filename);

    // apply "tsfiy" plugin
    tsify(bsf);

    toArray(bsf.bundle(), function (err, arr) {
      var str = Buffer.concat(arr).toString('utf8');

      // should include the expected compiled JS
      assert(-1 !== str.indexOf('var Foo'));
      assert(-1 !== str.indexOf('function Foo()'));

      // should include a sourceMappingURL
      assert(-1 !== str.indexOf('sourceMappingURL='));

      done();
    });
  });

});
