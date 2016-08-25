'use strict';

const Router = require('express').Router;
const debug = require('debug')('rito:task-router');
const jsonParser = require('body-parser').json();
const taskCrud = require('../lib/task-crud');
const sendError = require('../lib/error-response');
const taskRouter = module.exports = new Router();

taskRouter.post('/task', jsonParser, function(req, res){
  debug('Creating content');
  taskCrud.createTask(req.body)
  .then(task => res.send(task))
  .catch(err => res.sendError(err));
});

taskRouter.get('/task/:id', jsonParser, sendError, function(req, res){
  debug('Creating content');
  taskCrud.fetchTaskByTaskId(req.params.id)
  .then(task => res.send(task))
  .catch(err => res.sendError(err));
});

taskRouter.get('/task/:id/tasks', jsonParser, sendError,function(req, res){
  debug('Creating content');
  taskCrud.createTask(req.params.id)
  .then(task => res.send(task))
  .catch(err => res.sendError(err));
});

taskRouter.put('/task', jsonParser, function(req, res){
  debug('Creating content');
  taskCrud.updateTask(req.params.id,req.body)
  .then(task => res.send(task))
  .catch(err => res.sendError(err));
});

taskRouter.delete('/task/:id', jsonParser, function(req, res){
  debug('Creating content');
  taskCrud.createTask(req.params.id)
  .then(task => res.send(task).end())
  .catch(err => res.sendError(err));
});
