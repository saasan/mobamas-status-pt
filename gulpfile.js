/* jshint node: true */
'use strict';
var del = require('del');
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglifyjs');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
  files: [
    'index.html'
  ],
  out: 'release/',
  scss: {
    src: 'scss/*.scss',
    dest: 'release/css/'
  },
  js: {
    src: [
      'bower_components/ngstorage/ngStorage.min.js',
      'js/main.js'
    ],
    dest: 'release/js/',
    filename: 'main.min.js'
  },
  clean: [
    'release/*'
  ]
};

gulp.task('clean', del.sync.bind(null, paths.clean, { dot: true }));

gulp.task('copy', function() {
  gulp.src(paths.files, { base: './' })
    .pipe(gulp.dest(paths.out));
});

gulp.task('sass', function () {
  gulp.src(paths.scss.src)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.scss.dest));
});

gulp.task('sass-release', function () {
  gulp.src(paths.scss.src)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.scss.dest));
});

gulp.task('js', function () {
  gulp.src(paths.js.src)
    .pipe(concat(paths.js.filename))
    .pipe(gulp.dest(paths.js.dest));
});

gulp.task('js-release', function () {
  gulp.src(paths.js.src)
    .pipe(uglify(paths.js.filename))
    .pipe(gulp.dest(paths.js.dest));
});

gulp.task('watch', function() {
  gulp.watch('*.html', ['copy']);
  gulp.watch('scss/*.scss', ['sass']);
  gulp.watch('js/*.js', ['js']);
});

gulp.task('help', function() {
  var tasks = Object.keys(gulp.tasks).sort();

  console.log('');
  tasks.forEach(function(name) {
    console.log('  ' + name);
  });
  console.log('');
});

gulp.task('compile', ['clean', 'copy', 'sass','js']);
gulp.task('release', ['clean', 'copy', 'sass-release', 'js-release']);
gulp.task('default', ['compile']);
