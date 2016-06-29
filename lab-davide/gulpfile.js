'use strict';

const gulp =  require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');

const paths = ['*./js', 'lib/*.js', 'model/*.js;', 'test/*.js', 'route/*.js'];


gulp.task('eslint', function(){
  gulp.src(paths)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('test', function(){
  return gulp.src('test/*.js', {read: false})
  .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('watch', function(){
  gulp.watch('**/*.js', ['test', 'eslint']);
});

gulp.task('nodemon', function(){
  nodemon({
    script: 'server.js'
  , ext: 'js.html'
  , env: { 'NODE_ENV': 'deployment'}
  });
});

gulp.task('default', ['eslint', 'test', 'eslint', 'nodemon']);
