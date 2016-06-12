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

beliefRouter.get('/belief/:id', function(req, res){
  beliefCrud.fetchBeliefByDeityId(req.params.id)
  .then( belief => res.send(belief))
  .catch( err => res.sendError(err));
});

beliefRouter.put('/belief/:id', jsonParser, function(req, res){
  beliefCrud.updateBeliefByDeityId(req.params.id, req.body)
  .then( belief => res.send(belief))
  .catch( err => res.sendError(err));
});

beliefRouter.delete('/belief/:id', function(req, res){
  beliefCrud.deleteBeliefByDeityId(req.params.id)
  .then( (deity) =>{
    res.status(204).send(deity);
  })
  .catch( err => res.sendError(err));
});
