
/**
 * Module dependencies.
 */

var path = require('path');
var assert = require('assert');
var coffeeify = require('coffeeify');
var toArray = require('stream-to-array');
var BrowserifySingleFile = require('../');

describe('coffeeify', function () {

  it('should compile CoffeeScript to JavaScript', function (done) {
    var filename = path.resolve(__dirname, 'fixtures', 'func.coffee');
    var bsf = new BrowserifySingleFile(filename);

    // apply "coffeeify" transform
    bsf.transform(coffeeify);

    toArray(bsf.bundle(), function (err, arr) {
      var str = Buffer.concat(arr).toString('utf8');

      // should include the expected compiled JS
      assert(-1 !== str.indexOf('square'));
      assert(-1 !== str.indexOf('function(x)'));
      assert(-1 !== str.indexOf('return x * x'));

      // should include a sourceMappingURL
      assert(-1 !== str.indexOf('sourceMappingURL='));

      done();
    });
  });

});
