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

//GET - no jsonParser

//PUT - jsonParser

//DELETE - no jsonParser
