'use strict';

var config = require('../config');
var exit = require('gulp-exit');
var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('mocha', function() {
  process.env.NODE_ENV = 'test';

  return gulp.src(config.mocha.files, {
      read: false
    })
    .pipe(mocha(config.mocha.options));
});
