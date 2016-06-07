'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const brewerCrud = require('../lib/brewer-crud');
const taskCrud = require('../lib/task-crud.js');

const brewerRouter = module.exports = new Router();

brewerRouter.post('/brewer', jsonParser, function(req, res) {
  brewerCrud.createBrewer(req.body)
  .then(brewer => res.send(brewer))
  .catch(err => res.sendError(err));
});

brewerRouter.get('/brewer/:id', function(req, res) {
  brewerCrud.fetchBrewer(req.params.id)
  .then(brewer => res.send(brewer))
  .catch(err => res.sendError(err));
});

brewerRouter.get('/brewer/:id/tasks', function(req, res) {
  taskCrud.fetchTaskByBrewerId(req.params.id)
  .then(tasks => res.send(tasks))
  .catch(err => res.sendError(err));
});
