var gulp = require('gulp'),
  connect = require('gulp-connect'),
  gls = require('gulp-live-server');

gulp.task('serve', function() {
  var server = gls('./bin/www', undefined, 12345);
  server.start();

  gulp.watch('./routes/index.js', function() {
    server.start.bind(server)()
  });
});