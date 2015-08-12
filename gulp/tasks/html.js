var gulp = require('gulp');

// Basic usage
gulp.task('html', function() {
  return gulp.src(['src/client/public/index.ejs', 'src/client/public/error.ejs'])
    .pipe(gulp.dest('build/'));
});
