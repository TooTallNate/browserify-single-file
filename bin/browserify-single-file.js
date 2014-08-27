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

// apply any "transform" parameters
var transforms = [];
if (argv.transform) {
  if (Array.isArray(argv.transform)) {
    transforms.push.apply(transforms, argv.transform);
  } else {
    transforms.push(argv.transform);
  }
}
if (argv.t) {
  if (Array.isArray(argv.t)) {
    transforms.push.apply(transforms, argv.t);
  } else {
    transforms.push(argv.t);
  }
}
transforms.forEach(function (transform) {
  var t = require(transform);
  bsf.transform(t);
});


// apply any "plugin"
var plugins = [];
if (argv.plugin) {
  if (Array.isArray(argv.plugin)) {
    plugins.push.apply(plugins, argv.plugin);
  } else {
    plugins.push(argv.plugin);
  }
}
if (argv.p) {
  if (Array.isArray(argv.p)) {
    plugins.push.apply(plugins, argv.p);
  } else {
    plugins.push(argv.p);
  }
}
plugins.forEach(function (plugin) {
  var pargv = minimist(plugin.split(/\s+/));
  var pname = pargv._[0];
  var p = require(pname);
  p(bsf, pargv);
});


// output the pipeline to `stdout`
bsf.bundle().pipe(process.stdout);
