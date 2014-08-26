browserify-single-file
======================
### Runs browserify transforms/plugins on a single file.
#### Useful for make pipeline tasks.
[![Build Status](https://travis-ci.org/TooTallNate/browserify-single-file.svg?branch=master)](https://travis-ci.org/TooTallNate/browserify-single-file)


Like browserify(1), but just for a single file. Designed be used inside a
Makefile (ideally running with a high number of parallel `--jobs` running).


Installation
------------

Install `browserify-single-file` using `npm`:

``` bash
$ npm install --global browserify-single-file
```


CLI Usage
---------

A `browserify-single-file` executable gets installed into your `$PATH` when
installed with the npm `-g` global flag.

Say you have the TypeScript file `foo.ts`:

``` typescript
class Foo {
}
```

Now you can use the `tsify` browserify plugin to compile it to JavaScript, with
the source map inlined and included:

``` bash
$ browserify-single-file --plugin tsify foo.ts > foo.js
```

Which would output something like:

``` javascript
var Foo = (function () {
    function Foo() {
    }
    return Foo;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vLWNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi90ZXN0L2ZpeHR1cmVzL2Zvby1jbGFzcy50cyJdLCJuYW1lcyI6WyJGb28iLCJGb28uY29uc3RydWN0b3IiXSwibWFwcGluZ3MiOiJBQUFBO0lBQUFBO0lBQVdDLENBQUNBO0FBQUFELElBQURBLFdBQUNBO0FBQURBLENBQUNBLElBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBGb28ge31cbiJdfQ==
```

Now when it comes time to invoke `browserify(1)`, there's no need to use any
slow `--transform` or `--plugin` options since the transformation has already
taken place in the compiled `foo.js` file.

For future invokations of browserify, it won't need to recompile the TypeScript
file unless it gets changed again, since Make is good at keeping track of `mtime`
changes.
