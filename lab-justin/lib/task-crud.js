'use strict';

const Task = require('../model/task');
const debug = require('debug')('justin:task-crud');
const AppErr = require('./app-error');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const noteCrud = require('./note-crud');


exports.createTask = function(reqBody){
  return new Promise((resolve, reject) => {
    if (!reqBody.noteId)
      return reject(AppErr.error400('task require\'s noteId'));
    if (!reqBody.desc)
      return reject(AppErr.error400('tasks require\'s desc'));

    reqBody.timestamp = new Date();
    const task = new Task(reqBody);

    task.save()
    .then(task => resolve(task))
    .catch(err => reject(err));
  });
};

exports.fetchTaskByNoteId = function(noteId){
  return new Promise((resolve, reject) => {
    noteCrud.fetchNote({_id: noteId})
    .then( note => Task.find({noteId: note._id}))
    .then( tasks => resolve(tasks))
    // .catch( err => reject(err)); class note
    .catch( err => reject(AppErr.error404(err.message)));//lecture.com
  });
};

exports.removeAllTasks = function(){
  return Task.remove({});
};
//
exports.deleteTaskByNoteId = function(noteId) {
  return new Promise((resolve, reject) => {
    if(!noteId) return reject(AppErr.error400('task require\'s noteId'));

    noteCrud.deleteNote({_id: noteId})
    // .then( task => Task.delete({noteId: note._id}))
    .then( note => Task.find({noteId: note._id}))
    .then ( tasks => resolve(tasks))
    .catch( err => reject(err));
  });
};
