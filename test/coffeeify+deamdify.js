
/**
 * Module dependencies.
 */

var path = require('path');
var assert = require('assert');
var coffeeify = require('coffeeify');
var deamdify = require('deamdify');
var toArray = require('stream-to-array');
var BrowserifySingleFile = require('../');

describe('coffeeify, deamdify', function () {

  it('should compile AMD-style CoffeeScript to CommonJS JavaScript', function (done) {
    var filename = path.resolve(__dirname, 'fixtures', 'amd.coffee');
    var bsf = new BrowserifySingleFile(filename);

    // apply "coffeeify" transform
    bsf.transform(coffeeify);

    // apply "deamdify" transform
    bsf.transform(deamdify);

    toArray(bsf.bundle(), function (err, arr) {
      var str = Buffer.concat(arr).toString('utf8');

      // should include the expected compiled JS
      assert(-1 !== str.indexOf('var myModule = require(\'my/required/module\')'));
      assert(-1 !== str.indexOf('MyOtherModule.prototype.publicMethod'));
      assert(-1 !== str.indexOf('module.exports = MyOtherModule'));

      // should *not* include a sourceMappingURL :(
      assert(-1 === str.indexOf('sourceMappingURL='));

      done();
    });
  });

});
