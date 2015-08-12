'use strict';
var config = require('../config');
var gulp = require('gulp');

gulp.task('css', function() {
  return gulp.src(config.css.files)
  	.pipe(gulp.dest('build/'));
});
