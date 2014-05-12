/*
 * slush-webapp
 * https://github.com/jonkemp/slush-webapp
 *
 * Copyright (c) 2014, Jonathan Kemp
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _s = require('underscore.string'),
    inquirer = require('inquirer'),
    fs = require('fs'),
    wiredep = require('wiredep');

gulp.task('default', function (done) {
    inquirer.prompt([
            {
                type: 'input',
                name: 'appname',
                message: 'Give your app a name',
                default: gulp.args.join(' ')
            }, {
                type: 'checkbox',
                name: 'features',
                message: 'Which other options would you like to include?',
                choices: [{
                    name: 'Sass',
                    value: 'includeSass',
                    checked: true
                }, {
                    name: 'Bootstrap',
                    value: 'includeBootstrap',
                    checked: true
                }, {
                    name: 'Modernizr',
                    value: 'includeModernizr',
                    checked: true
                }]
            }, {
                type: 'confirm',
                name: 'moveon',
                message: 'Continue?'
            }
        ],
        function (answers) {
            var features = answers.features;

            var hasFeature = function (feat) {
                return features.indexOf(feat) !== -1;
            };

            answers.includeSass = hasFeature('includeSass');
            answers.includeBootstrap = hasFeature('includeBootstrap');
            answers.includeModernizr = hasFeature('includeModernizr');

            if (!answers.moveon) {
                return done();
            }

            answers.appNameSlug = _s.slugify(answers.appname);

            gulp.src(__dirname + '/templates/**')
                .pipe(template(answers))
                .pipe(rename(function(file) {
                    if (file.basename[0] === '_') {
                        file.basename = '.' + file.basename.slice(1);
                    }
                    if (answers.includeSass && file.extname === '.css') {
                        file.extname = '.scss';
                    }
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install());

            process.on('exit', function () {
                var bowerJson = JSON.parse(fs.readFileSync('./bower.json'));

                // wire Bower packages to .html
                wiredep({
                    bowerJson: bowerJson,
                    directory: 'app/bower_components',
                    src: 'app/index.html'
                });

                if (answers.includeSass) {
                    // wire Bower packages to .scss
                    wiredep({
                        bowerJson: bowerJson,
                        directory: 'app/bower_components',
                        src: 'app/styles/*.scss'
                    });
                }

                gutil.log('After running `npm install & bower install`, inject your front end dependencies into');
                gutil.log('your HTML by running:');
                gutil.log('  gulp wiredep');

                done();
            });
        });
});
