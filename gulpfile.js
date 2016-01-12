var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat');

gulp.task('connect', function() {
  connect.server({
    port: 8010,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./app/**/*.html')
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src('./app/**/*.js')
    .pipe(connect.reload());
});

gulp.task('scss', function() {
  gulp.src('./app/**/*.scss')
    .pipe(connect.reload());
});

gulp.task('concatAndBuildCss', function () {
  gulp.src('./app/**/*.scss')
    .pipe(concat('test.scss'))
    .pipe(sass())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('watch', function () {
  gulp.watch(['./app/**/*.html'], ['html']);
  gulp.watch(['./app/**/*.js'], ['js']);
  gulp.watch(['./app/**/*.scss'], ['scss']);
});

gulp.task('serve', ['concatAndBuildCss', 'connect', 'watch']);