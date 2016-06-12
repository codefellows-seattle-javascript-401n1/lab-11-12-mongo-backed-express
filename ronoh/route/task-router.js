'use strict';

const Router = require('express').Router;
// const debug = require('debug')('ronito:task-router');
const taskCrud = require('../lib/task-crud');
const jsonParser = require('body-parser');

const taskRouter = module.exports = new Router;

taskRouter.post('/task', jsonParser, function(req, res){
  taskCrud.createTask(req.body)
  .then(task => res.send(task))
  .catch(err => res.sendError(err));
});
