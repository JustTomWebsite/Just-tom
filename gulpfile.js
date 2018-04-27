const gulp = require('gulp')
const sass = require('gulp-sass')
const imageMin = require('gulp-imagemin')
const minify = require('gulp-minify-css')
 
gulp.task('sass', function () {
  return gulp.src('./app/index.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(minify())
    .pipe(gulp.dest('./dist'))
});

gulp.task('audio-assets', function() {
  return gulp.src('./audio/**/*')
    .pipe(gulp.dest('./dist/audio'))
})

gulp.task('image-assets', function() {
  return gulp.src('./images/**/*')
    .pipe(imageMin())
    .pipe(gulp.dest('./dist/images'))
})
 
gulp.task('default', ['sass', 'audio-assets', 'image-assets'], function () {
  gulp.watch(['./app/scss/**/*.scss', './app/scss/index.scss'], ['sass'])
  gulp.watch(['./images/**/*'], ['image-assets'])
  gulp.watch(['./audio/**/*'], ['audio-assets'])
});