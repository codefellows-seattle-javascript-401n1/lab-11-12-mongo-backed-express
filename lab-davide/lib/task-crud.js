'use strict';

const Task = require('../model/task');
const AppErr = require('../lib/app-error');
const debug = require('debug')('task:task-crud');

exports.createTask = function(reqBody) {
  debug('createTask is working');
  return new Promise((resolve, reject) => {
    if(!reqBody.desc){
      return reject(AppErr.error400('task requires a desc'));
    }
    if(!reqBody.content){
      return reject(AppErr.error400('task requires a content'));
    }
    reqBody.dueDate = new Date();
    const task = new Task(reqBody);
    task.save()
    .then(resolve)
    .catch(reject);
  });
};

exports.fetchTask = function(id) {
  debug('fetchTask is working');
  return new Promise((resolve, reject) => {
    Task.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.deleteTask = function(id) {
  debug('deleteTask is working');
  return new Promise((resolve, reject) => {
    Task.remove({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeAllTask = function(){
  return Task.remove({});
};
