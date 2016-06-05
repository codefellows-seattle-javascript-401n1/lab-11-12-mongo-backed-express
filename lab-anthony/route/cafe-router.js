'use strict';

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

// //GET - no jsonParser
// cafeRouter.get('/cafes/all', function(req, res){
//   console.log('CALLED GET ALL');
//   //res with all
// });

cafeRouter.get('/cafes/:id', function(req, res){
  console.log('CALLED GET BY ID');
  cafeCrud.fetchCafe(req.params.id)
  .then(cafe => res.send(cafe))
  .catch(err => res.sendError(err));
});

//PUT - jsonParser

//DELETE - no jsonParser
