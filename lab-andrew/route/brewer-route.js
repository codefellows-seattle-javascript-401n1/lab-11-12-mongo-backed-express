'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const brewerCrud = require('../lib/brewer-crud');
// const brewCrud = require('../lib/brew-crud.js');
const AppError = require('../lib/app-error');

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

brewerRouter.get('/', function(req, res) {
  const err = AppError.error400('bad request, please provide ID');
  res.sendError(err);
});

brewerRouter.put('/brewer/:id', jsonParser, function(req, res) {
  if(!req.body.name) {
    const err = AppError.error400('bad request, please provide a name');
    res.sendError(err);
  } else {
    brewerCrud.fetchBrewer(req.params.id)
    .then(function(brewer) {
      brewer.name = req.body.name;
      brewer.save();
      res.status(200).json(brewer);
    }).catch(function(err) {
      res.sendError(err);
    });
  }
});

brewerRouter.delete('/brewer/:id', function(req, res) {
  brewerCrud.deleteBrewer(req.params.id)
  .then(brewer => res.status(204).send(`deleted:${brewer}`))
  .catch(err => res.sendError(err));
});
