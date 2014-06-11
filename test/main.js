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
                features: [],
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

        it('should create expected files', function (done) {
            gulp.start('default').once('stop', function () {
                mockGulpDest.assertDestContains([
                    '.bowerrc',
                    '.editorconfig',
                    '.gitattributes',
                    '.gitignore',
                    '.jshintrc',
                    'package.json',
                    'bower.json',
                    'gulpfile.js',
                    'app/404.html',
                    'app/favicon.ico',
                    'app/robots.txt',
                    'app/index.html',
                    'app/scripts/main.js'
                ]);

                done();
            });
        });
    });

    describe('default generator: sass feature', function () {
        it('should create css file', function (done) {
            mockPrompt({
                features: [],
                moveon: true
            });
            gulp.start('default').once('stop', function () {
                mockGulpDest.assertDestContains('app/styles/main.css');
                mockGulpDest.assertDestNotContains('app/styles/main.scss');
                done();
            });
        });

        it('should create scss file', function (done) {
            mockPrompt({
                features: ['includeSass'],
                moveon: true
            });
            gulp.start('default').once('stop', function () {
                mockGulpDest.assertDestNotContains('app/styles/main.css');
                mockGulpDest.assertDestContains('app/styles/main.scss');
                done();
            });
        });
    });
});
