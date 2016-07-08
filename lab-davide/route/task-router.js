'use strict';


//we are requiring the Router function from the express module//
const Router = require('express').Router;
const debug = require('debug')('task:task-router');
const JsonParser = require('body-parser').json();

//app modules//
const taskRouter = module.exports = new Router();
const taskCrud = require('../lib/task-crud');


//adding POST request//
taskRouter.post('/task', JsonParser, function(req, res) {
  debug('hitting task post');
  taskCrud.createTask(req.body)
  .then(task => res.send(task))
  .catch(err => res.sendError(err));
});

// adding GET request//
taskRouter.get('/task/:id', JsonParser, function(req, res) {
  debug('get task in route');
  taskCrud.fetchTask(req.params.id)
  .then(task => res.send(task))
  .catch(err => res.sendError(err));

});

//adding DELETE request//
taskRouter.delete('/task/:id', JsonParser, function(req, res) {
  debug('hitting /task delete');
  taskCrud.deleteTask(req.params.id)
  .then((task) => {
    res.status(204).send(task);
  })
  .catch(err => res.sendError(err));
});
