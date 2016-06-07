'use strict';

const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const receiptCrud = require('../lib/receipt-crud');

const receiptRouter = module.exports = new Router();

receiptRouter.post('/receipt', bodyParser, function(req, res){
    receiptCrud.createReceipt(req.body)
    .then*receipt => res.send(note))
    .catch(err => res.sendError(err))
});
