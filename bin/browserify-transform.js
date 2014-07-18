#!/usr/bin/env node

/**
 * Module dependencies.
 */

var fs = require('fs');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2));

var transform = argv.transform || argv.t;
var filenames = argv._;
if (filenames.length !== 1) {
  throw new Error('only one source filename supported at a time');
}
var filename = filenames[0];

var t = require(transform);

fs.createReadStream(filename).pipe(t(filename)).pipe(process.stdout);
