'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const deityCrud = require('../lib/deity-crud');

const deityRouter = module.exports = new Router();

deityRouter.post('/deity', jsonParser, function(req, res){
  deityCrud.createDeity(req.body)
  .then( deity => res.send(deity))
  .catch( err => res.sendError(err));
});

deityRouter.get('/deity/:id', function(req, res){
  deityCrud.fetchDeity(req.params.id)
  .then( deity => res.send(deity))
  .catch( err => res.sendError(err));
});

deityRouter.put('/deity/:id', jsonParser, function(req, res){
  console.log('inside put route');
  deityCrud.updateDeity(req.params.id, req.body)
  .then( deity => res.send(deity))
  .catch( err => res.sendError(err));
});

deityRouter.delete('/deity/:id', function(req, res){
  deityCrud.deleteDeity(req.params.id)
  .then( deity => res.send(deity))
  .catch( err => res.sendError(err));
});
