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
    //save the instance of receipt to mongo db and create _id
    receipt.save()
    .then(resolve)
    .catch(reject);

  });
};

exports.getReceipt = function(id){
  debug('entered getReceipt in receipt-crud.js');
  return new Promise((resolve, reject) => {
    Receipt.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.putReceipt = function(id, reqBody){
  return new Promise((resolve, reject) => {
    Receipt.update({_id: id}, reqBody)
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
