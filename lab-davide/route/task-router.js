'use strict';
//node modules
//npm modules
//app modules
//global

//we are requiring the Router function from the express module//
const Router = require('express').Router;
const debug = require('debug')('task:task-router');
const JsonParser = require('body-parser').json();

//app modules//
const taskRouter = module.exports = new Router();
const taskCrud = require('./../lib/task-crud');
console.log('const taskCrud' + taskCrud);



//adding POST request//
taskRouter.post('/task', JsonParser, function(req, res) {
  debug('post task');
  taskCrud.createTask(req.body)
  .then(task => res.send(task))
  .catch(err => res.sendError(err));
});

// adding GET request//
taskRouter.get('/:id', function(req, res) {
  debug('get task');
  taskCrud.fetchTask(req.params.id)
  .then(task => res.send(task))
  .catch(err => res.sendError(err));

});

//adding PUT request//
taskRouter.put('/:id', function(req, res) {
  debug('put task');
  taskCrud.updateTask(req.params.id, req.body)
  .then(task => res.send(task))
  .catch(err => res.sendError(err));

});

//adding DELETE request//
taskRouter.delete('/:id', function(req, res) {
  debug('delete task');
  taskCrud.deleteTask(req.params.id)
  .then(task => res.send(task))
  .catch(err => res.sendError(err));

});
