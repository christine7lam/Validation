'use strict';

var config = require('../config').clean
var del = require('del');
var gulp = require('gulp');

gulp.task('clean', del.bind(null, config.files));
