'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var path = require('path');

gulp.task('test', function(done) {
    karma.start({
        configFile: path.join(__dirname, '../karma.conf.js'),
        singleRun: true
    }, done);
});
