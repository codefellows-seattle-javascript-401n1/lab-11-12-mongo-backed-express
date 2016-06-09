'use strict';

const Receipt = require('../model/receipt');
const AppErr = require('./app-error');
const debug = require('debug')('business:receipt-ops');

exports.createReceipt = function(reqBody){
  return new Promise((resolve, reject) => {
    if(!reqBody.customerLastName)
      return reject(AppErr.error400('receipt needs customer name'));
    if(!reqBody.autoMake)
      return reject(AppErr.error400('receipt needs auto make'));

    const receipt = new Receipt(reqBody);
    receipt.save()
    .then(resolve)
    .catch(reject);

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
    Receipt.update({_id: id}, reqBody)
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeReceipt = function(id){
  return new Promise((resolve, reject) => {
    Receipt.remove({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeReceiptDocuments = function(){
  return Receipt.remove({});
};
