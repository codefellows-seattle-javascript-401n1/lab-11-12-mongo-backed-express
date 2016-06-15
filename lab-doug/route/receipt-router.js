'use strict';

const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const debug = require('debug')('business:receipt-router');
const receiptCrud = require('../lib/receipt-crud');
const receiptRouter = module.exports = new Router();


receiptRouter.post('/receipt', bodyParser, function(req, res){
  debug('entered post in receipt-router.js');
  receiptCrud.createReceipt(req.body)
    //for fat arrow functions that do not have{}, the value on the right is implicitly returned
    .then (receipt => res.send(receipt))
    .catch(err => res.sendError(err));
});

receiptRouter.get('/receipt/:id', function(req, res){
  debug('entered get in receipt-router.js');
  receiptCrud.getReceipt(req.params.id)
    .then (receipt => res.send(receipt))
    .catch(err => res.sendError(err));
});

receiptRouter.put('/receipt/:id', bodyParser, function(req, res){
  debug('entered put in receipt-router.js');
  receiptCrud.putReceipt(req.params.id, req.body)
    .then (receipt => res.send(receipt))
    .catch(err => res.sendError(err));
});

receiptRouter.delete('/receipt/:id', function(req, res){
  debug('entered delete in receipt-router.js');
  receiptCrud.removeReceipt(req.params.id)
    .then (receipt => res.send(receipt))
    .catch(err => res.sendError(err));
});
