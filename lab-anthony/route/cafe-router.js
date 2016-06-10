'use strict';

const debug = require('debug');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const cafeCrud = require('../lib/cafe-crud');

const cafeRouter = module.exports = new Router();

cafeRouter.post('/cafes', jsonParser, function(req, res){
  console.log('CALLED POST');
  cafeCrud.createCafe(req.body)
  .then(cafe => res.send(cafe))
  .catch(err => res.sendError(err));
});

// cafeRouter.get('/cafes/all', function(req, res){
//   //fetch all
// });

cafeRouter.get('/cafes/:id', function(req, res){
  debug('CALLED GET BY ID');
  cafeCrud.fetchCafe(req.params.id)
  .then(cafe => res.send(cafe))
  .catch(err => res.sendError(err));
});

//PUT - jsonParser

//DELETE - no jsonParser
cafeRouter.delete('/cafes/:id', function(req, res){
  debug('CALLED DELETE BY ID');
  cafeCrud.removeCafe(req.params.id)
  .then(() => res.status(204).send())
  .catch(err => res.sendError(err));
});
