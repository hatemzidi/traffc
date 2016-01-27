'use strict';
// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var clean = require('gulp-clean');
var minifyHtml = require('gulp-minify-html');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var ngHtml2Js = require('gulp-ng-html2js');
var ngConfig = require('gulp-ng-config');
var runSequence = require('run-sequence');
var rimraf = require('gulp-rimraf');

// tasks
gulp.task('lint', function () {
    gulp.src(['./app/**/*.js', '!./app/**/*.min.js', '!./app/lib/**', '!./app/old/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('clean:pre', function () {
    return gulp.src(['app/js/bundled.js', 'tmp/js/', './dist'], {read: false})
        .pipe(rimraf({force: true}));
});

gulp.task('clean:post', function () {
    return gulp.src(['tmp/js'], {read: false})
        .pipe(rimraf({force: true}));
});

gulp.task('loadConfig', function () {
    gulp.src('app/js/config/*.json')
        .pipe(ngConfig('traffc', {
            createModule: false,
            wrap: true
        }))
        .pipe(gulp.dest('tmp/js/config'));
});


gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify({mangle: false})))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});


gulp.task('copy-js', function () {
    gulp.src('./app/cordova.js')
        .pipe(gulp.dest('dist'));

    gulp.src('./app/js/config/**')
        .pipe(gulp.dest('dist/js/config'));
});

// Fonts
gulp.task('copy-fonts', function () {
    return gulp.src(['./app/lib/font-awesome/fonts/fontawesome-webfont.*', './app/lib/bootstrap/fonts/*'])
        .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('copy-libs', function () {
    gulp.src('./app/js/lib/**')
        .pipe(gulp.dest('dist/js/lib'));
});


gulp.task('copy-vendor', function () {
    gulp.src('./app/lib/**')
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('copy-img', function () {
    gulp.src('./app/img/**')
        .pipe(gulp.dest('dist/img'));
});

gulp.task('copy-views', function () {
    gulp.src('./app/views/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: 'traffc',
            prefix: 'views/'
        }))
        .pipe(concat('views.js'))
        .pipe(uglify())
        .pipe(gulp.dest('tmp/js/views'));
});

gulp.task('connect', function () {
    connect.server({
        root: 'app/',
        port: 8888
    });
});

gulp.task('connectDist', function () {
    connect.server({
        root: 'dist/',
        port: 9999
    });
});

gulp.task('concat', ['useref'], function() {
    return gulp.src(['dist/js/traffc.js','./tmp/js/views/*.js', './tmp/js/config/*.js'])
        .pipe(concat('traffc.js'))
        .pipe(gulp.dest('dist/js'));
});


// // *** default task *** //
// gulp.task('default',
//   ['lint', 'browserify', 'connect']
// );
// // *** build task *** //
// gulp.task('build',
//   ['lint', 'minify-css', 'browserifyDist', 'copy-html-files', 'copy-bower-components', 'connectDist']
// );

// *** default task *** //
gulp.task('default', function () {
    runSequence(
        ['clean'],
        ['lint', 'browserify'] // , 'connect'
    );
});
// *** build task *** //
gulp.task('build', function () {
    runSequence(
        ['clean:pre'],
        ['lint', 'copy-views', 'useref', 'concat', 'copy-libs', 'copy-js', 'copy-img', 'copy-fonts' ],
        ['clean:post']
    );
});
