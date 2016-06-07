'use strict';

const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const receiptCrud = require('../lib/receipt-ops');

const receiptRouter = module.exports = new Router();

receiptRouter.post('/receipt', bodyParser, function(req, res){
  receiptCrud.createReceipt(req.body)
    //for fat arrow functions that do not have{}, the value on the right is implicitly returned
    .then (receipt => res.send(receipt))
    .catch(err => res.sendError(err));
});
