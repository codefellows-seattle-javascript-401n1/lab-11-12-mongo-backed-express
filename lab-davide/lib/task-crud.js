'use strict';

const Task = require('../model/task');
const AppErr = require('../lib/app-error');
const debug = require('debug')('task:task-crud');

exports.createTask = function(reqBody) {
  debug('createTask');
  return new Promise((resolve, reject) => {
    if(! reqBody.noteId)
      return reject(AppErr.error400('task requires noteId'));
    if(! reqBody.desc)
      return reject(AppErr.error400('task requires a desc'));

    const task = new Task(reqBody);
    task.save()
    .then(resolve)
    .catch(reject);
  });
};

//Fetch//
exports.fetchTask = function(id) {
  debug('fetchTask');
  return new Promise((resolve, reject) => {

    Task.findOne({_id: id})
    .then(resolve)
    .catch(reject(AppErr.error404('not found')));
  });
};

//Need help with update task/
exports.updateNote = function(id, updateContent) {
  debug('updateNote');
  return new Promise((resolve, reject) => {
    if(!id){
      return reject(AppErr.error400('bad request'));
    }
    if(!updateContent.name) {
      return reject(AppErr.error400('bad request'));
    }

    Task.findOne({_id: id})
    .then(resolve)
    .catch(reject(AppErr.error404('not found')));
  });
};


exports.deleteNote = function(id) {
  debug('deleteNote');
  return new Promise((resolve, reject) => {
    Task.findOne({_id: id})
    .then(resolve)
    .catch(reject(AppErr.error(404)('not found')));
  });
};

exports.removeAllNotes = function(){
  return Task.remove({});
};
