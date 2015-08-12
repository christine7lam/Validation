var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {

    //tycoon theme
    gulp.src('src/client/public/themes/tycoon/main.scss')
        .pipe(sass({
            includePaths: [
                'node_modules/bootstrap-sass/assets/stylesheets',
                'src/client/public'
            ]
        }))
        .pipe(gulp.dest('build/'));

    //fonts
    gulp.src('node_modules/bootstrap-sass/assets/fonts/bootstrap/*')
        .pipe(gulp.dest('build/fonts/'));

    //images
    gulp.src('src/client/public/images/**/*')
        .pipe(gulp.dest('build/images/'));

});