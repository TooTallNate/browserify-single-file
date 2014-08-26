#!/usr/bin/env node

/**
 * Module dependencies.
 */

var minimist = require('minimist');
var BrowserifySingleFile = require('../');

var argv = minimist(process.argv.slice(2));

var filenames = argv._;
if (filenames.length !== 1) {
  throw new Error('only one source filename may be given at a time');
}
var filename = filenames.shift();

var bsf = new BrowserifySingleFile(filename);

// apply any "transform"
var transform = argv.transform || argv.t;
if (transform) {
  var t = require(transform);
  bsf.transform(t);
}

// apply any "plugin"
var plugin = argv.plugin || argv.p;
if (plugin) {
  var pargv = minimist(plugin.split(/\s+/));
  var pname = pargv._[0];
  var p = require(pname);
  p(bsf, pargv);
}

// output the pipeline to `stdout`
bsf.bundle().pipe(process.stdout);
