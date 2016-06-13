'use strict';

const debug = require('debug')('store:store-crud');

const storeCrud = require('/store-crud');
const StoreItem = require('../model/store-item');
const AppError = require('./app-error');

exports.createStoreItem = function(reqBody){
  return new Promise((resolve, reject) => {
    if (!reqBody.storeId){
      return reject(AppError.error400('store items require storeId'));
    }
    if (!reqBody.item){
      return reject(AppError.error400('store items require an item'));
    }
    const item = new StoreItem(reqBody);
    item.save()
    .then(item => resolve(item))
    .catch(err => reject(err));
  });
}; // end createStore

exports.fetchStoreItemByStoreId = function(storeId){
  return new Promise((resolve, reject) => {
    storeCrud.fetchStore(storeId)
    .then( store => StoreItem.find({storeId: store._id}))
    .then( items => resolve(items))
    .catch( err => reject(err));
  });
};

exports.removeAllStoreItems = function(){
  return StoreItem.remove({});
};
