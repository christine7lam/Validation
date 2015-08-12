'use strict';

var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', function() {
  gulp.watch(config.browser.files, ['browserify']);
  gulp.watch(config.html.files, ['html']);
  gulp.watch(config.sass.files, ['sass']);
});