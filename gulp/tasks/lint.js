'use strict';

var config = require('../config').lint;
var gulp = require('gulp');
var jshint = require('gulp-jshint');
require('jshint-stylish');

gulp.task('lint', function() {
  return gulp.src(config.files)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});
