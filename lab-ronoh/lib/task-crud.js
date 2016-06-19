'use strict';

// const debug = require('debug')('ronito: task-crud');
const mongoose = require('mongoose');
mongoose.Promise= require('bluebird');
const Task = require('../model/task');
const noteCrud = require('./note-crud');
const AppError = require('./app-error');

exports.createTask = function(reqBody){
  return new Promise((resolve, reject)=> {
    if(!reqBody.noteId)
      return reject(AppError.error400('task requires noteId'));
    if(!reqBody.description)
      return reject(AppError.error400('task requires a description'));

    const task = new Task(reqBody);
    task.save()
  .then(task => resolve(task))
  .catch(err => reject(err));
  });
};

exports.fetchTaskByNoteId = function(noteId){
  return new Promise((resolve, reject) =>{
    noteCrud.fetchNote({_id: noteId})
    .then(note => Task.find({noteId: note._id}))
    .then(tasks => resolve(tasks))
    .catch(err => reject(err));
  });
};
exports.fetchTaskByTaskId = function(id){
  return new Promise((resolve, reject) =>{
    noteCrud.fetchNote({_id: id})
    .then(task => Task.find({_id: task.id}))
    .then(tasks => resolve(tasks))
    .catch(err => reject(err));
  });
};
exports.removeAllTasks = function(){
  return Task.remove({});
};
