'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const brewCrud = require('../lib/brew-crud');
const AppError = require('../lib/app-error');
const brewRouter = module.exports = new Router();

brewRouter.post('/brew', jsonParser, function(req, res) {
  brewCrud.createBrew(req.body)
  .then(brew => res.send(brew))
  .catch(err => res.sendError(err));
});

brewRouter.get('/brew', function(req, res) {
  brewCrud.fetchBrewByBrewerId(req.params.id)
  .then(brews => res.send(brews))
  .catch(err => res.sendError(err));
});

brewRouter.put('/brew/:id', jsonParser, function(req, res) {
  console.log('hit route');
  if(!req.body.brewOrigin) {
    const err = AppError.error400('bad request, please provide a brew');
    res.sendError(err);
  } else {
    brewCrud.fetchBrew(req.params.id)
    .then(function(brew) {
      console.log('BREW; ', JSON.stringify(brew));
      brew.roastDate = req.body.roastDate;
      brew.brewOrigin = req.body.brewOrigin;
      brew.save();
      res.status(200).json(brew);
    }).catch(function(err) {
      console.error('ERROR: ', err);
      res.sendError(err);
    });
  }
});
brewRouter.delete('/brew/:id', function(req, res) {
  brewCrud.deleteBrew(req.params.id)
  .then(brew => res.status(204).send('deleted: ' + brew))
  .catch(err => res.sendError(err));
});
