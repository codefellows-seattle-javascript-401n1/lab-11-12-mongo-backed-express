'use strict';

const Router = require('express').Router;
const debug = require('debug')('justin:task-router');
const jsonParser = require('body-parser').json();
const taskCrud = require('../lib/task-crud');
const taskRouter = module.exports = new Router();

taskRouter.post('/note/:id/task', jsonParser, function(req, res){
  taskCrud.createTask(req.body)
  .then( task => res.send(task))
  .catch( err => res.sendError(err));
});

taskRouter.get('/note/:id/task', function(req, res){
  taskCrud.fetchTaskByNoteId(req.params.id)
  .then(task => res.send(task))
  .catch(err => res.sendError(err));
});

taskRouter.delete('/note/:id/task', function(req, res){
  taskCrud.removeAllTasks(req.params.id)
  .then(task => res.send(task))
  .catch(err => res.sendError(err));
});

// taskRouter.put('/note/:id/task', jsonParser, function(req, res){
//   taskCrud.updateNote(req.params.id, req.body)
//   .then(task => res.send(task))
//   .catch(err => res.sendError(err));
// });
