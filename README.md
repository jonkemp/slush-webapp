# [slush](https://github.com/slushjs/slush)-webapp [![Build Status](https://secure.travis-ci.org/jonkemp/slush-webapp.png?branch=master)](https://travis-ci.org/jonkemp/slush-webapp)

> Easily scaffold out a front-end web app with [Gulp](https://github.com/gulpjs/gulp)

## Features

### Includes:
* HTML5 Boilerplate
* jQuery
* Modernizr
* Bootstrap

### What you can do:
* Watch and compile Sass files automatically
* Automatically wire-up dependencies installed with Bower
* Start a server to preview your code with LiveReload
* Automatically lint your scripts
* Concatenate and minify CSS and JavaScript files

For more information on what this generator can do for you, take a look at the [gulp plugins](https://github.com/jonkemp/slush-webapp/blob/master/templates/package.json) used in the `package.json`. Please see the [gulpfile.js](https://github.com/jonkemp/slush-webapp/blob/master/templates/gulpfile.js) for up to date information on what is supported.

## Getting Started

### Installation

Install `slush-webapp` globally:

```bash
$ npm install -g slush-webapp
```

Remember to install `slush` globally as well, if you haven't already:

```bash
$ npm install -g slush
```

### Usage

Create a new folder for your project:

```bash
$ mkdir my-slush-webapp
```

Run the generator from within the new folder:

```bash
$ cd my-slush-webapp && slush webapp
```

## Options

- `--skip-install`
  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.

## Getting To Know Slush

Slush is a tool that uses Gulp for project scaffolding. To find out more about Slush, check out the [documentation](https://github.com/slushjs/slush).

## Contributing

See the [CONTRIBUTING Guidelines](https://github.com/jonkemp/slush-webapp/blob/master/CONTRIBUTING.md)

## License 

The MIT License

Copyright (c) 2014, Jonathan Kemp

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

