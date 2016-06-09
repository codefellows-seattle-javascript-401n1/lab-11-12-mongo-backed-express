'use strict';

const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const debug = require('debug')('business:receipt-router');
const receiptOps = require('../lib/receipt-ops');
const receiptRouter = module.exports = new Router();


receiptRouter.post('/receipt', bodyParser, function(req, res){
  receiptOps.createReceipt(req.body)
    //for fat arrow functions that do not have{}, the value on the right is implicitly returned
    .then (receipt => res.send(receipt))
    .catch(err => res.sendError(err));
});

receiptRouter.get('/receipt/:id', function(req, res){
  receiptOps.getReceipt(req.params.id)
    .then (receipt => res.send(receipt))
    .catch(err => res.sendError(err));
});

receiptRouter.put('/receipt/:id', bodyParser, function(req, res){
  receiptOps.putReceipt(req.params.id, req.body)
    .then (receipt => res.send(receipt))
    .catch(err => res.sendError(err));
});

receiptRouter.del('/receipt/:id', function(req, res){
  receiptOps.deleteReceipt(req.params.id)
    .then (receipt => res.send(receipt))
    .catch(err => res.sendError(err));
});
