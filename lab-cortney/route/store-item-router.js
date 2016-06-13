'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const storeCrud = require('../lib/store-crud');

const storeItemRouter = module.exports = new Router();

storeItemRouter.post('/store', jsonParser, function(req, res){
  storeCrud.createStore(req.body)
  .then( store => res.send(store))
  .catch( err => res.sendError(err));
});

storeItemRouter.get('/store/:id', function(req, res){
  storeCrud.fetchStore(req.params.id)
  .then( store => res.send(store))
  .catch( err => res.sendError(err));
});

storeItemRouter.put('/store/:id', jsonParser, function(req, res){
  storeCrud.updateStore(req.params.id, req.body)
  .then( store => res.send(store))
  .catch( err => res.sendError(err));
});

storeItemRouter.delete('/store/:id', function(req, res){
  storeCrud.deleteStore(req.params.id)
  .then( () => res.send(res.status(204)))
  .catch( err => res.sendError(err));
});
