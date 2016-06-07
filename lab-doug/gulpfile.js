'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const nodemon = require('nodemon');
const mocha = require('gulp-mocha');

const paths = ['*.js', 'lib/*.js', 'model/*.js', 'route/*.js', 'test/*.js'];


gulp.task('eslint', function(){
  gulp.src(paths)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('mocha', function(){
  return gulp.src([''])
    //stream  through gulp-mocha
    .pipe(mocha());
});

gulp.task('nodemon', function(){
  nodemon({
    script: 'server.js',
    ext: 'js'
  });
});

gulp.task('default', ['eslint', 'mocha']);
