/*
 * slush-webapp
 * https://github.com/jonkemp/slush-webapp
 *
 * Copyright (c) 2014, Jonathan Kemp
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _s = require('underscore.string'),
    inquirer = require('inquirer');

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
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install())
                .on('end', function () {
                    done();
                });
        });
});
