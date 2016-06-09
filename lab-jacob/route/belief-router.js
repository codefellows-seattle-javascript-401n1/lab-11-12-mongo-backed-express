'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const beliefCrud = require('../lib/belief-crud');

const beliefRouter = module.exports = new Router();

beliefRouter.post('/belief', jsonParser, function(req, res){
  beliefCrud.createBelief(req.body)
  .then( belief => res.send(belief))
  .catch( err => res.sendError(err));
});

beliefRouter.get('/belief/:id', jsonParser,function(req, res){
  beliefCrud.fetchBeliefByDeityId(req.params.id)
  .then( belief => res.send(belief))
  .catch( err => res.sendError(err));
});
