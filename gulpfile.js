var browserify   = require('browserify');
var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var copy         = require('gulp-copy');
var concat       = require('gulp-concat-css');
var minify       = require('gulp-minify-css');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var path         = require('path');
var buffer       = require('vinyl-buffer');
var source       = require('vinyl-source-stream');
var watchify     = require('watchify');
var uglify       = require('gulp-uglify');
var main         = 'src/js/app.js';

/**
 * Copies files that don't get processed. They are just copied straight to the
 * build folder.
 */
gulp.task('copy', function () {
    gulp.src('src/views/index.html')
        .pipe(copy('build', {prefix: 2}));
    gulp.src('src/main.js')
        .pipe(copy('build', {prefix: 1}));
    gulp.src('package.json')
        .pipe(copy('build'));
});

/**
 * Here we process Sass:
 * - Convert it to traditional CSS
 * - Add vendor prefixes
 * - Add sourcemaps
 * - Save it to src/css/app.css
 */
gulp.task('sass', function () {
    return gulp.src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css'));
});

/**
 * This further processes our CSS. We take the CSS generated from our SASS:
 * - Minifiy it
 * - Concat it to one file
 * - Save it to the build folder
 */
gulp.task('css', function () {
    return gulp.src([
            'src/css/import.css',
            'src/css/app.css'
        ])
        .pipe(minify({
            relativeTo: 'build',
            target: 'build'
        }).on('error', function (e) {
            console.log(e);
        }))
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('build'));
});

/**
 * Processes our JavaScript:
 * - Bundles it with Browserify
 * - Uglifies it
 * - Saves it to our build folder
 */
gulp.task('js', function(){
    return processJs(browserify(main, {
        debug: true,
        ignoreMissing: true
    }));
});

/**
 * Watch for changes to our JS.
 */
gulp.task('js-watch', function () {
    // Get the Browserify options that are need to be set to work with
    // Watchify
    var options = watchify.args;
    // Enable source maps
    options.debug = true;
    // Tell Browserify to skip missing modules. This is needed since the
    // Electron modules we require() in our JS are fullfilled by Electon.
    options.ignoreMissing = true;
    // Initialize browserify and pass it to watchify and assign it to a
    // variable.
    var bundler = watchify(browserify(main, options));
    // On change, rebundle!
    bundler.on('update', function() {
        console.log('Watchify detected a change.');
        processJs(bundler);
    });
});

/**
 * Watch for changes to our SASS.
 */
gulp.task('sass-watch', function () {
    return gulp.watch('src/scss/**/*.scss', ['sass']);
});

/**
 * Watch for changes to our CSS.
 */
gulp.task('css-watch', function () {
    return gulp.watch('src/css/**/*.css', ['css']);
});

/**
 * Watch for changes to our non-processed files.
 */
gulp.task('copy-watch', function () {
    return gulp.watch([
            'src/views/index.html',
            'src/main.js',
            'package.json'
        ], ['copy']);
});

/**
 * This runs all the tasks and ends without watching for changes.
 */
gulp.task('build', ['copy', 'sass', 'css', 'js']);

/**
 * This runs the build task, then starts watching for changes.
 */
gulp.task('default', ['build', 'sass-watch', 'copy-watch', 'css-watch', 'js-watch']);

/**
 * This is encapsulated in a function since it's used by two different tasks.
 */
function processJs (bundler) {
    return bundler.bundle()
        .on('error', function(e) {
            console.error('Browserify Error', e.message);
        })
        .pipe(source('app.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('build'));
}