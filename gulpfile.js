'use strict';
// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyHtml = require('gulp-html-minifier');
var concat = require('gulp-concat');
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var ngHtml2Js = require('gulp-ng-html2js');
var preprocess = require('gulp-preprocess');
var runSequence = require('run-sequence');
var rimraf = require('gulp-rimraf');
var props2json = require('gulp-props2json');
var git = require('git-rev-sync');
var dateFormat = require('dateformat');
var xeditor = require('gulp-xml-editor');
var jeditor = require('gulp-json-editor');
var cordova = require('gulp-cordova');
var inject = require('gulp-inject');
var Yargs = require('yargs');

var now = new Date();
var argv = Yargs.argv;


/**
 * Build Settings
 */
var settings = {

    /*
     * Environment to build our application for
     *
     * If we have passed an environment via a
     * CLI option, then use that. If not attempt
     * to use the NODE_ENV. If not set, use production.
     */
    environment: !!argv.env ?
        argv.env
        : process.env.NODE_ENV || 'production',

    /*
     * mobile or desktop?
     */
    device: !!argv.device ?
        argv.device : 'mobile',

    /*
     * release / build
     */
    version: !!argv.version ?
        argv.version : '0.9.7',

    /*
     * release / build
     */
    release: git.short() + '-' + dateFormat(now, 'yymmddHHMM'),

    /*
     * Where is our config folder?
     */
    configFolder: '/js/config',

    /*
     * Where is our code?
     */
    srcFolder: 'app',

    /*
     * Where are we building to?
     */
    buildFolder: 'build',

    /*
     * Where should the final file be?
     */
    destFolder: 'dist',


    /*
     * Where should the final file be?
     */
    cordovaFolder: 'www'

};


// tasks
gulp.task('lint', function () {
    gulp.src(['./app/**/*.js', '!./app/**/*.min.js', '!./app/lib/**', '!./app/js/lib/*.js', '!./app/old/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('clean:pre', function () {
    return gulp.src(['./tmp/js', './dist'], {read: false})
        .pipe(rimraf({force: true}));
});

gulp.task('clean:post', function () {
    return gulp.src(['tmp/js'], {read: false})
        .pipe(rimraf({force: true}));
});

gulp.task('clean:www', function () {
    return gulp.src(['www/'], {read: false})
        .pipe(rimraf({force: true}));
});


gulp.task('preprocess', ['concat'], function () {
    return gulp.src('./dist/*.html')
        .pipe(preprocess({
                context: {
                    PKG_ENV: settings.device,
                    RELEASE_TAG: settings.release,
                    DEBUG: true
                }
            })
        )
        .pipe(gulp.dest('./dist/'));
});


gulp.task('inject-ga', ['preprocess'], function () {
    gulp.src('./dist/*.html')
        .pipe(inject(gulp.src(['./app/js/lib/ga.min.js']), {
            starttag: '<!-- inject:analytics -->',
            transform: function (filePath, file) {
                return file.contents.toString('utf8'); // Return file contents as string
            }
        }))
        .pipe(gulp.dest('./dist/'));
});


gulp.task('update-version', function () {
    gulp.src('./config.xml')
        .pipe(xeditor([
            {path: '//xmlns:widget', attr: {'version': settings.version}}
        ], 'http://www.w3.org/ns/widgets'))
        .pipe(gulp.dest('./'));


    gulp.src('./package.json')
        .pipe(jeditor({
            'version': settings.version
        }))
        .pipe(gulp.dest('./'));

    gulp.src('./bower.json')
        .pipe(jeditor({
            'version': settings.version
        }))
        .pipe(gulp.dest('./'));

});


gulp.task('cordova-build-android', function () {
    return gulp.src('./package.json')
        .pipe(cordova(['build', 'android']));
});

gulp.task('cordova-build-ios', function () {
    return gulp.src('./package.json')
        .pipe(cordova(['build', 'ios']));
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
    if (settings.device === 'mobile') {
        gulp.src('./app/cordova.js')
            .pipe(gulp.dest('dist'));
    }

    gulp.src('./app/js/config/**')
        .pipe(gulp.dest('dist/js/config'));
});

// Fonts
gulp.task('copy-fonts', function () {
    return gulp.src(['./app/lib/font-awesome/fonts/fontawesome-webfont.*', './app/lib/bootstrap/fonts/*'])
        .pipe(gulp.dest('dist/fonts/'));
});


// Fonts
gulp.task('copy-locales', function () {
    gulp.src('./app/locales/*.properties')
        .pipe(props2json())
        .pipe(gulp.dest('./dist/locales'));
});

// libs other than vendors
gulp.task('copy-libs', function () {
    gulp.src('./app/js/lib/**')
        .pipe(gulp.dest('dist/js/lib'));
});

// Images
gulp.task('copy-img', function () {
    gulp.src('./app/img/**')
        .pipe(gulp.dest('dist/img'));
});

// Static files
gulp.task('copy-static', function () {
    if (settings.device === 'desktop') {
        gulp.src([
                'static/favicon.ico',
                'static/403.html',
                'static/404.html',
                'static/500.html',
                'static/browserconfig.xml',
                'static/manifest.*',
                'static/.htaccess'
            ])
            .pipe(gulp.dest('dist/'));


        gulp.src('static/favicons/*')
            .pipe(gulp.dest('dist/favicons'));

        gulp.src('static/meta_preview.*')
            .pipe(gulp.dest('dist/img'));
    }
});

// Views for angular
gulp.task('copy-views', function () {
    gulp.src('./app/views/*.html')
        .pipe(preprocess({
            context: {
                VERSION_TAG: settings.version,
                RELEASE_TAG: settings.release
            }
        }))
        .pipe(minifyHtml({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(ngHtml2Js({
            moduleName: 'traffc',
            prefix: 'views/'
        }))
        .pipe(concat('views.js'))
        .pipe(uglify())
        .pipe(gulp.dest('tmp/js/views'));
});


gulp.task('copy-www', function () {
    gulp.src('./dist/**/*')
        .pipe(gulp.dest('www'));
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

gulp.task('concat', ['useref'], function () {
    return gulp.src(['dist/js/traffc.js', 'tmp/js/views/*.js'])
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
        ['lint', 'copy-views', 'useref', 'concat', 'preprocess', 'inject-ga', 'copy-libs', 'copy-locales', 'copy-js', 'copy-img', 'copy-fonts', 'copy-static'],
        ['clean:post']
    );
});

// *** build android *** //
gulp.task('build-android', function () {
    runSequence(
        ['clean:www'],
        ['update-version'],
        ['copy-www']
    );
});

// *** build ios *** //
gulp.task('build-ios', function () {
    runSequence(
        ['clean:www'],
        ['update-version'],
        ['copy-www']
    );
});

