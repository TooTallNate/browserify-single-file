
/**
 * Module dependencies.
 */

var path = require('path');
var assert = require('assert');
var browserifyJade = require('browserify-jade');
var toArray = require('stream-to-array');
var BrowserifySingleFile = require('../');

describe('browserify-jade', function () {

  it('should compile Jade templates to JavaScript', function (done) {
    var filename = path.resolve(__dirname, 'fixtures', 'foo.jade');
    var bsf = new BrowserifySingleFile(filename);

    // apply "browserify-jade" transform
    bsf.transform(browserifyJade);

    toArray(bsf.bundle(), function (err, arr) {
      var str = Buffer.concat(arr).toString('utf8');

      // should include the expected compiled JS
      assert(-1 !== str.indexOf('var jade = require(\'jade/lib/runtime.js\')'));
      assert(-1 !== str.indexOf('buf.push("\\n<div class=\\"foo\\">");'));

      // should include a sourceMappingURL
      assert(-1 !== str.indexOf('sourceMappingURL='));

      done();
    });
  });

});
