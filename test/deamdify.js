
/**
 * Module dependencies.
 */

var path = require('path');
var assert = require('assert');
var deamdify = require('deamdify');
var toArray = require('stream-to-array');
var BrowserifySingleFile = require('../');

describe('deamdify', function () {

  it('should convert AMD style modules to CommonJS style', function (done) {
    var filename = path.resolve(__dirname, 'fixtures', 'amd.js');
    var bsf = new BrowserifySingleFile(filename);

    // apply "deamdify" transform
    bsf.transform(deamdify);

    toArray(bsf.bundle(), function (err, arr) {
      var str = Buffer.concat(arr).toString('utf8');

      // should include the expected compiled JS
      assert(-1 !== str.indexOf('var alpha = require(\'alpha\');'));
      assert(-1 !== str.indexOf('module.exports = {'));
      assert(-1 !== str.indexOf('return alpha.verb() + 2'));

      // should *not* include a sourceMappingURL :(
      assert(-1 === str.indexOf('sourceMappingURL='));

      done();
    });
  });

});
