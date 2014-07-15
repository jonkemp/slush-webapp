'use strict';

var gulp = require('gulp');

gulp.task('clean', function (cb) {
    require('rimraf')('dist', cb);
});

gulp.task('lint', function () {
    var jshint = require('gulp-jshint');

    return gulp.src('app/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
<% if (includeSass) { %>
gulp.task('styles', function () {
    var sass = require('gulp-sass'),
        cssbeautify = require('gulp-cssbeautify');

    return gulp.src('app/styles/*.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(cssbeautify())
        .pipe(gulp.dest('app/styles'));
});<% } %>

gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;
<% if (includeSass) { %>
    gulp.src('app/styles/*.scss')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app/styles'));
<% } %>
    gulp.src('app/*.html')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static('app'))
        .use(connect.directory('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function() {
            console.log('Started connect web server on http://localhost:9000.');
        });
});

gulp.task('server', [<% if (includeSass) { %>'styles', <% } %>'connect'], function () {
    var livereload = require('gulp-livereload'),
        server = livereload();

    require('opn')('http://localhost:9000');
    <% if (includeSass) { %>
    gulp.watch('app/styles/**/*.scss', ['styles']);<% } %>

    gulp.watch(['app/styles/**/*.<%= includeSass ? 'scss' : 'css' %>', 'app/scripts/**/*.js', 'app/*.html']).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('images', function () {
    return gulp.src('app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}')
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
    return gulp.src('app/styles/fonts/*')
        .pipe(gulp.dest('dist/styles/fonts'));
});

gulp.task('misc', function () {
    return gulp.src([
            config.app + '/*.{ico,png,txt}'
        ])
        .pipe(gulp.dest('dist'));
});

gulp.task('html', ['lint'<% if (includeSass) { %>, 'styles'<% } %>], function () {
    var minifycss = require('gulp-minify-css'),
        useref = require('gulp-useref'),
        gulpif = require('gulp-if'),
        uglify = require('gulp-uglify');

    return gulp.src('app/*.html')
        .pipe(useref.assets())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifycss()))
        .pipe(useref.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['clean'], function () {
    gulp.start('images', 'fonts', 'misc', 'html');
});

gulp.task('default', ['build']);
