'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const storeCrud = require('../lib/store-crud');

const storeRouter = module.exports = new Router();

storeRouter.post('/store', jsonParser, function(req, res){
  storeCrud.createStore(req.body)
  .then( store => res.send(store))
  .catch( err => res.sendError(err));
});

storeRouter.get('/store/:id', function(req, res){
  storeCrud.fetchStore(req.params.id)
  .then( store => res.send(store))
  .catch( err => res.sendError(err));
});

storeRouter.put('/store/:id', jsonParser, function(req, res){
  storeCrud.updateStore(req.params.id, req.body)
  .then( store => res.send(store))
  .catch( err => res.sendError(err));
});

storeRouter.delete('/store/:id', function(req, res){
  storeCrud.deleteStore(req.params.id)
  .then( () => res.send(res.status(204)))
  .catch( err => res.sendError(err));
});
