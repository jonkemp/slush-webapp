'use strict';

var gulp = require('gulp'),
    config = {
        app: 'app',
        dist: 'dist',
        port: 9000,
        scripts: function () {
            return this.app + '/scripts/*.js';
        },
        styles: function () {
            return this.app + '/styles';
        },
        html: function () {
            return this.app + '/*.html';
        }
    };

config.scripts.apply(config);
config.styles.apply(config);
config.html.apply(config);

gulp.task('clean', function(cb) {
    require('rimraf')(config.dist, cb);
});

gulp.task('lint', function() {
    var path = config.scripts(),
        jshint = require('gulp-jshint');

    return gulp.src(path)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
<% if (includeSass) { %>
gulp.task('styles', function () {
    var dir = config.styles(),
        sass = require('gulp-sass'),
        cssbeautify = require('gulp-cssbeautify');

    return gulp.src(dir + '/*.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(cssbeautify())
        .pipe(gulp.dest(dir));
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

gulp.task('connect', function() {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static(config.app))
        .use(connect.directory(config.app));

    require('http').createServer(app)
        .listen(config.port)
        .on('listening', function() {
            console.log('Started connect web server on http://localhost:' + config.port + '.');

            require('opn')('http://localhost:' + config.port);
        });
});

gulp.task('server', [<% if (includeSass) { %>'styles', <% } %>'connect'], function() {
    var jsPath = config.scripts(),
        cssPath = config.styles(),
        htmlPath = config.html(),
        livereload = require('gulp-livereload'),
        server = livereload();
    <% if (includeSass) { %>
    gulp.watch(cssPath + '/**/*.scss', ['styles']);<% } %>

    gulp.watch([cssPath + '/**/*.<%= includeSass ? 'scss' : 'css' %>', jsPath, htmlPath]).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('images', function(){
    return gulp.src(config.app + '/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}')
        .pipe(gulp.dest(config.dist + '/images'));
});

gulp.task('fonts', function(){
    var cssPath = config.styles();

    return gulp.src(cssPath + '/fonts/*')
        .pipe(gulp.dest(config.dist + '/styles/fonts'));
});

gulp.task('misc', function(){
    return gulp.src([
            config.app + '/*.{ico,png,txt}'
        ])
        .pipe(gulp.dest(config.dist));
});

gulp.task('html', ['lint'<% if (includeSass) { %>, 'styles'<% } %>], function(){
    var htmlPath = config.html(),
        minifycss = require('gulp-minify-css'),
        useref = require('gulp-useref'),
        filter = require('gulp-filter'),
        jsFilter = filter('**/*.js'),
        cssFilter = filter('**/*.css'),
        uglify = require('gulp-uglify');

    return gulp.src(htmlPath)
        .pipe(useref.assets())
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(minifycss())
        .pipe(cssFilter.restore())
        .pipe(useref.restore())
        .pipe(useref())
        .pipe(gulp.dest(config.dist));
});

gulp.task('build', ['clean'], function(){
    gulp.start('images', 'fonts', 'misc', 'html');
});

gulp.task('default', ['build']);