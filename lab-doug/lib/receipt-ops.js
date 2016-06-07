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
    if(!reqBody.autoYear)
      return reject(AppErr.error400('receipt needs auto year'));
    if(!reqBody.repairName)
      return reject(AppErr.error400('receipt needs repair name'));

    const receipt = new Receipt(reqBody);
    receipt.save()
    .then(resolve)
    .catch(reject);

  });
};

exports.removeReceiptDocuments = function(){
  return new Promise(function(resolve, reject){
    return Receipt.remove({});
  });
};
