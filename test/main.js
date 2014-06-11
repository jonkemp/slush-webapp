/* jshint node:true */
/* global require, it, before, beforeEach, describe */

'use strict';
var should = require('should'),
    inquirer = require('inquirer'),
    gulp = require('gulp'),
    mockGulpDest = require('mock-gulp-dest')(gulp);

require('../slushfile');

/**
 * Mock inquirer prompt
 */

function mockPrompt(answers) {
    inquirer.prompt = function (prompts, done) {

        [].concat(prompts).forEach(function (prompt) {
            if (!(prompt.name in answers)) {
                answers[prompt.name] = prompt.default;
            }
        });

        done(answers);
    };
}

describe('slush-webapp', function() {
    before(function () {
        process.chdir(__dirname);
        process.argv.push('--skip-install');
    });

    describe('default generator', function () {
        beforeEach(function () {
            mockPrompt({
                features: [{
                    name: 'Sass',
                    value: 'includeSass',
                    checked: false
                }, {
                    name: 'Bootstrap',
                    value: 'includeBootstrap',
                    checked: false
                }, {
                    name: 'Modernizr',
                    value: 'includeModernizr',
                    checked: false
                }],
                moveon: true
            });
        });

        it('should put all project files in current working directory', function (done) {
            gulp.start('default').once('stop', function () {
                mockGulpDest.cwd().should.equal(__dirname);
                mockGulpDest.basePath().should.equal(__dirname);
                done();
            });
        });

        it('should add dot files to project root', function (done) {
            gulp.start('default').once('stop', function () {
                mockGulpDest.assertDestContains([
                    '.bowerrc',
                    '.editorconfig',
                    '.gitattributes',
                    '.gitignore',
                    '.jshintrc'
                ]);

                done();
            });
        });

        it('should add bower.json and package.json to project root', function (done) {
            gulp.start('default').once('stop', function () {
                mockGulpDest.assertDestContains([
                    'package.json',
                    'bower.json'
                ]);

                done();
            });
        });

        it('should add a gulpfile to project root', function (done) {
            gulp.start('default').once('stop', function () {
                mockGulpDest.assertDestContains('gulpfile.js');
                done();
            });
        });

        it('should add an index.html to the app folder', function (done) {
            gulp.start('default').once('stop', function () {
                mockGulpDest.assertDestContains('app/index.html');
                done();
            });
        });
    });
});
