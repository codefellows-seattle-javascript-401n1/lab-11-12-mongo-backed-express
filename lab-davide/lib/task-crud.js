'use strict';

const Task = require('../model/task');
const AppErr = require('../lib/app-error');
const debug = require('debug')('task:task-crud');

exports.createTask = function(reqBody) {
  debug('createTask');
  return new Promise((resolve, reject) => {
    if(! reqBody.noteId)
      return reject(AppErr.error400('tasks require noteId'));
    if(! reqBody.desc)
      return reject(AppErr.error400('tasks requires a desc'));
    const task = new Task(reqBody);
    task.save()
  .then(task => resolve(task))
  .catch(err => reject(err));
  });
};

exports.removeAllTasks = function() {
  return Task.remove({});
};
