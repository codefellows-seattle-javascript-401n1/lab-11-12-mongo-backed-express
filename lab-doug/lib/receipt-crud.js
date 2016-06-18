'use strict';

const Receipt = require('../model/receipt');
const AppErr = require('./app-error');
const debug = require('debug')('business:receipt-crud');

exports.createReceipt = function(reqBody){
  debug('entered createReceipt in receiptCrud.js');
  return new Promise((resolve, reject) => {
    if(!reqBody.customerLastName)
      return reject(AppErr.error400('receipt needs customer name'));
    if(!reqBody.autoMake)
      return reject(AppErr.error400('receipt needs auto make'));
    //construct an instance of receipt
    const receipt = new Receipt(reqBody);
    //save the instance of receipt to mongo db.
    receipt.save()
    /*  mongo will return a copy of the receipt it creates to 'then', which will be handled by receiptRouter.get 'then'*/
    .then(resolve)
    .catch(reject);

  });
};

exports.getReceipt = function(id){
  debug('entered getReceipt in receiptCrud.js');
  return new Promise((resolve, reject) => {
    Receipt.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.putReceipt = function(id, reqBody){
  debug('entered putReceipt in receiptCrud.js');
  return new Promise((resolve, reject) => {
    Receipt.findOneAndUpdate({_id: id}, reqBody, {new:true})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeReceipt = function(id){
  debug('entered removeReceipt in receiptCrud.js');
  return new Promise((resolve, reject) => {
    Receipt.findOneAndRemove({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeReceiptDocuments = function(){
  debug('entered removeReceiptDocuments in receiptCrud.js');
  return Receipt.remove({});
};
