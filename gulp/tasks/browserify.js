var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var babelify = require('babelify');

var source = require("vinyl-source-stream");

// Basic usage
gulp.task('browserify', function() {

    var b = browserify();
    b.transform(babelify);
    b.transform(reactify);
    b.add('./src/client/main.js');

    return b.bundle().pipe(source('app.js')).pipe(gulp.dest('build/'));
});
