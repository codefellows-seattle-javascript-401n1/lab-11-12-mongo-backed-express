'use strict';

const Repair = require('../model/repair');
const AppErr = require('./app-error');
const debug = require('debug')('business:repair-crud');

exports.createRepair = function(reqBody){
  debug('entered createRepair in repair-crud.js');
  return new Promise((resolve, reject) => {
    if(!reqBody.mechanicLastName)
      return reject(AppErr.error400('repair needs mechanics name'));
    if(!reqBody.repairName)
      return reject(AppErr.error400('repair needs a name'));
    if(!reqBody.laborCost)
      return reject(AppErr.error400('repair needs a labor cost'));
    if(!reqBody.partsCost)
      return reject(AppErr.error400('repair needs a parts cost'));
    if(!reqBody.receiptId)
      return reject(AppErr.error400('repair needs a receipt ID'));

    const repair = new Repair(reqBody);
    repair.save()
    .then(repair => resolve(repair))
    .catch(err => reject(err));
  });
};

exports.getRepair = function(id){
  return new Promise((resolve, reject) => {
    Repair.find({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.putRepair = function(id, reqBody){
  return new Promise((resolve, reject) => {
    Repair.findOneAndUpdate({_id: id}, reqBody, {new:true})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeRepair = function(id){
  return new Promise((resolve, reject) => {
    Repair.findOneAndRemove({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeAllRepairs = function(){
  return Repair.remove({});
};
