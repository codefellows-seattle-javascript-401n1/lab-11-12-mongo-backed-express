'use strict';

const Router = require('express').Router;
// const debug = require('debug')('ronito:task-router');
const taskCrud = require('../lib/task-crud');
const jsonParser = require('body-parser').json();
const sendError = require('../lib/error-response');

const taskRouter = module.exports = new Router;

taskRouter.post('/task', jsonParser, sendError, function(req, res){
  taskCrud.createTask(req.body)
  .then(task => res.send(task))
  .catch(err => res.sendError(err));
});

taskRouter.get('/task/:id', jsonParser, sendError, function(req,res){
  taskCrud.fetchTask(req.params.id)
  .then(task => res.send(task))
  .catch(err=> res.sendError(err));
});

taskRouter.get('/task/:id', sendError, function(req, res){
  taskCrud.fetchTaskBytaskId(req.params.id)
  .then(tasks => res.send(tasks))
  .catch(err=>res.sendError(err));
});

taskRouter.put('/task/:id', jsonParser, sendError, function(req, res){
  taskCrud.updateTask(req.params.id, req.body)
    .then(task => res.send(task))
    .catch(err => {
      res.sendError(err);
    });
});

taskRouter.delete('/task/:id', sendError, function(req, res){
  taskCrud.removeTask(req.params.id)
  .then(() => res.status(204).end())
  .catch(err => res.sendError(err));
});
