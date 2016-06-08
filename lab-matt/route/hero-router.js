'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const heroCrud = require('../lib/hero-crud');
// const powerCrud = require('../lib/power-crud');
const AppError = require('../lib/app-error');
const heroRouter = module.exports = new Router();

heroRouter.post('/hero', jsonParser, function(req, res){
  heroCrud.createHero(req.body)
  .then(hero => res.send(hero))
  .catch( err => res.sendError(err));
});

heroRouter.get('/hero/:id', function(req,res){
  heroCrud.fetchHero(req.params.id)
  .then(hero => res.send(hero))
  .catch(err => res.sendError(err));
});

heroRouter.get('/', function(req, res){
  const err = AppError.error400('bad request, no ID was provided');
  res.sendError(err);
});



heroRouter.put('/hero/:id', jsonParser, function(req, res){
  if(!req.body.name) {
    const err = AppError.error400('bad request, no name provided.  Only name can be updated');
    res.sendError(err);
  } else {
    heroCrud.fetchHero(req.params.id)
    .then(function(hero){
      hero.name = req.body.name;
      hero.save();
      res.status(200).json(hero);
    }).catch(function(err){
      res.sendError(err);
    });
  }
});

heroRouter.delete('/hero/:id', function(req, res) {
  heroCrud.deleteHero(req.params.id)
  .then(hero => res.status(204).send('deleted: ' + hero))
  .catch(err => res.sendError(err));
});
