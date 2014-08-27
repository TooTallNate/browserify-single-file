
/**
 * Module dependencies.
 */

var path = require('path');
var assert = require('assert');
var reactify = require('reactify');
var toArray = require('stream-to-array');
var BrowserifySingleFile = require('../');

describe('reactify', function () {

  it('should compile React JSX to JavaScript', function (done) {
    var filename = path.resolve(__dirname, 'fixtures', 'hello.jsx');
    var bsf = new BrowserifySingleFile(filename);

    // apply "reactify" transform
    bsf.transform(reactify);

    toArray(bsf.bundle(), function (err, arr) {
      var str = Buffer.concat(arr).toString('utf8');

      // should include the expected compiled JS
      assert(-1 !== str.indexOf('React.DOM.div'));
      assert(-1 !== str.indexOf('HelloMessage({'));

      // should *not* include any HTML markup
      assert(-1 === str.indexOf('<div>'));

      done();
    });
  });

});
