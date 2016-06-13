'use strict';

const debug = require('debug')('store:store-crud');

const Store = require('../model/store');
const AppError = require('./app-error');

exports.createStore = function(reqBody){
  return new Promise((resolve, reject) => {
    if (!reqBody.store){
      return reject(AppError.error400('store requires a store name'));
    }
    if (!reqBody.name){
      return reject(AppError.error400('store requires a name'));
    }

    reqBody.timestamp = new Date();
    const store = new Store(reqBody);
    store.save()
    .then(resolve)
    .catch(reject);
  });
}; // end of createStore

exports.fetchStore = function(id){
  return new Promise((resolve, reject) => {
    debugger;
    Store.findOne({_id: id})
    .then(resolve)
    .catch( err => reject(AppError.error404(err.message)));
  });
};

exports.updateStore = function(id, reqBody){
  return new Promise((resolve, reject) => {
    if (!reqBody.name && !reqBody.store){
      return reject(AppError.error400('can only update a name and/or store'));
    }

    if (reqBody.name) {
      Store.findOneAndUpdate({_id: id},
        { $set: { name: reqBody.name } },
      { validationRun: true, new: true })
      .then(resolve)
      .catch( err => reject(AppError.error404(err.message)));
    }

    if (reqBody.store) {
      Store.findOneAndUpdate({_id: id},
        { $set: { store: reqBody.store } },
        { validationRun: true, new: true })
      .then(resolve)
      .catch( err => reject(AppError.error404(err.message)));
    }
  });
}; // end of updateStore

exports.deleteStore = function(id){
  return new Promise((resolve, reject) => {
    Store.remove({_id: id})
    .then((err, res) => {
      resolve(res.status(204));
    })
    .catch( err => reject(AppError.error404(err.message)));
  });
};

// ability to remove all stores in db for testing purposes only
exports.removeAllStores = function(){
  return Store.remove();
};
