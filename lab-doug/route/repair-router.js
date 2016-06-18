'use strict';

const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const debug = require('debug')('business:repair-router');
const repairCrud = require('../lib/repair-crud');
const repairRouter = module.exports = new Router();


repairRouter.post('/repair', bodyParser, function(req, res){
  debug('entered post() in repair-router.js');
  repairCrud.createRepair(req.body)
    //for fat arrow functions that do not have{}, the value on the right is implicitly returned
    .then (repair => res.send(repair))
    .catch(err => res.sendError(err));
});
repairRouter.get('/repair/:id', function(req, res){
  debug('entered get() in repair-router.js');
  repairCrud.getRepair(req.params.id)
    //for fat arrow functions that do not have{}, the value on the right is implicitly returned
    .then (repair => res.send(repair))
    .catch(err => res.sendError(err));
});

repairRouter.put('/repair/:id', bodyParser, function(req, res){
  debug('entered put in repair-router.js');
  repairCrud.putRepair(req.params.id, req.body)
    .then (repair => res.send(repair))
    .catch(err => res.sendError(err));
});
repairRouter.delete('/repair/:id', function(req, res){
  debug('entered delete() in repair-router.js');
  repairCrud.removeRepair(req.params.id)
    //for fat arrow functions that do not have{}, the value on the right is implicitly returned
    .then (repair => res.send(repair))
    .catch(err => res.sendError(err));
});
