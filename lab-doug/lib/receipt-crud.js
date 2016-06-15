'use strict';

const Receipt = require('../model/receipt');
const AppErr = require('./app-error');
const debug = require('debug')('business:receipt-crud');

exports.createReceipt = function(reqBody){
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
    .then(receipt => resolve)
    .catch(err => reject(err));

  });
};

exports.getReceipt = function(id){
  return new Promise((resolve, reject) => {
    Receipt.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.putReceipt = function(id, reqBody){
  return new Promise((resolve, reject) => {
    Receipt.findOneAndUpdate({_id: id}, reqBody, {new:true})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeReceipt = function(id){
  return new Promise((resolve, reject) => {
    Receipt.findOneAndRemove({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeReceiptDocuments = function(){
  return Receipt.remove({});
};
