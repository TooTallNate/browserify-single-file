#!/usr/bin/env node

/**
 * Module dependencies.
 */

var fs = require('fs');
var events = require('events');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2));

var filenames = argv._;
if (filenames.length !== 1) {
  throw new Error('only one source filename supported at a time');
}
var filename = filenames[0];

var source = fs.createReadStream(filename);
var next = source;

// emulate browserify's API a little bit
var bundle = new events.EventEmitter();
bundle._extensions = Object.keys(require.extensions);
bundle._entries = [ filename ];
bundle.transform = function (t) {
  next = next.pipe(t(filename));
};

// apply any "transform"
var transform = argv.transform || argv.t;
if (transform) {
  var t = require(transform);
  bundle.transform(t);
}

// apply any "plugin"
var plugin = argv.plugin || argv.p;
if (plugin) {
  var p = require(plugin);
  p(bundle);
}

bundle.emit('bundle');

// output the pipeline to `stdout`
next.pipe(process.stdout);
