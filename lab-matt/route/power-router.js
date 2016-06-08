'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const powerCrud = require('../lib/power-crud');
const powerRouter = module.exports = new Router;
const AppError = require('../lib/app-error');


powerRouter.post('/power', jsonParser, function(req, res){
  powerCrud.createPower(req.body)
  .then( power => res.send(power))
  .catch( err => res.sendError(err));
});

powerRouter.get('/hero/:id/power', function(req, res){
  powerCrud.fetchPowerByHeroId(req.params.id)
  .then(powers => res.send(powers))
  .catch(err => res.sendError(err));
});

powerRouter.get('/power/:id', function(req, res){
  powerCrud.fetchPower(req.params.id)
  .then(power => res.send(power))
  .catch(err => res.sendError(err));
});

powerRouter.put('/power/:id', jsonParser, function(req, res){
  if(!req.body.power) {
    const err = AppError.error400('bad request, no power provided');
    res.sendError(err);
  } else {
    powerCrud.fetchPower(req.params.id)
    .then(function(power){
      power.power = req.body.power;
      power.weakness = req.body.weakness;
      power.save();
      res.status(200).json(power);
    }).catch(function(err){
      res.sendError(err);
    });
  }
});

powerRouter.delete('/power/:id', function(req, res) {
  powerCrud.deletePower(req.params.id)
  .then(power => res.status(204).send('deleted: ' + power))
  .catch(err => res.sendError(err));
});
