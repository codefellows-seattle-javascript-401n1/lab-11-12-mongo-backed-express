'use strict';

const debug = require('debug')('drink: drink-route');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const drinkCrud = require('../lib/drink-crud');

const drinkRouter = module.exports = new Router();

drinkRouter.post('/drinks', jsonParser, function(req, res){
  debug('drinkRouter POST');
  drinkCrud.createDrink(req.body)
  .then(drink => res.send(drink))
  .catch(err => res.sendError(err));
});

//GET BY ID
drinkRouter.get('/drinks/:id', function(req, res){
  debug('drinkRouter GET');
  drinkCrud.fetchDrink(req.params.id)
  .then(drink => res.send(drink))
  .catch(err => res.sendError(err));
});

//POST BY ID
drinkRouter.put('/drinks/:id', jsonParser, function(req, res){
  debug('drinkRouter PUT');
  drinkCrud.editDrink(req.params.id, req.body)
  .then((drink)=>{
    res.send(drink);
  })
  .catch((err)=>{
    res.sendError(err);
  });
});

//DELETE BY ID
