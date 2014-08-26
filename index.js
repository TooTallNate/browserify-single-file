
/**
 * Module dependencies.
 */

var fs = require('fs');
var events = require('events');
var inherits = require('util').inherits;

/**
 * Module exports.
 */

module.exports = BrowserifySingleFile;

/**
 * Emulates "browserify"s Bundle API such that browserify compatible
 * "transforms" and "plugins" work as expected, but only on a single file,
 * as opposed to traversing through the require() chain and executing on all
 * files.
 *
 * The idea is that browserify itself should *only* deal with regular JavaScript
 * files, and not have plugins/transforms at the bundle level. make(1) is great at
 * parallelizing tasks, so instead transforms and plugins should be performed on
 * a per-file basis at the Make level, such that all the necessary compiled *.js
 * files are created by the time browserify(1) itself gets run.
 * 
 * `make -j10` is your friend...
 *
 * @class
 * @public
 */

function BrowserifySingleFile (filename, opts) {
  if (!(this instanceof BrowserifySingleFile))
    return new BrowserifySingleFile(filename, opts);

  events.EventEmitter.call(this);

  this.filename = filename;
  this._source = fs.createReadStream(filename);
  this._next = this._source;

  // emulate browserify's API a little bit
  this._extensions = Object.keys(require.extensions);
  this._entries = [ filename ];
}
inherits(BrowserifySingleFile, events.EventEmitter);

/**
 * Adds a `transform`.
 *
 * @public
 */

BrowserifySingleFile.prototype.transform = function (transform) {
  this._next = this._next.pipe(transform(this.filename));
};

/**
 * Returns the final link in the bundle chain, so that you can do something with
 * the output.
 *
 * @public
 */

BrowserifySingleFile.prototype.bundle = function () {
  this.emit('bundle');
  return this._next;
};
