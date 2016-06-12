'use strict';
//debug
const debug = require('debug')('drink:drink-crud');

//drink model 'Drink'
const Drink = require('../model/drink');

//app-error
const AppErr = require('./app-error');

//create a drink
exports.createDrink = function(reqBody){
  debug('createDrink');
  return new Promise((resolve, reject)=>{
    if(!reqBody.drinkName && !reqBody.drinkDesc && !reqBody.locId){
      debug('createDrink AppErr');
      return reject(AppErr.error400('drink requires name, description, and location id'));
    }

    const drink = new Drink(reqBody);
    drink.save()
    .then(drink => resolve(drink))
    .catch(err => reject(err));
  });
};

//get/fetch a drink
exports.fetchDrinkById = function(id){
  debug('fetchDrinkById');
  return new Promise((resolve, reject) =>{
    Drink.findOne({_id: id})
    .then(drink => resolve(drink))
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

//fetch drinks by cafe id
exports.fetchDrinksByCafeId = function(id){
  debug('fetchDrinksByCafeId');
  return new Promise((resolve, reject)=>{
    Drink.find({locId: id})
    .then((drinks)=>{
      return resolve(drinks);
    })
    .catch((err)=>{
      return reject(AppErr.error404(err.message));
    });
  });
};

//update a drink
exports.editDrink = function(id, reqBody){
  debug('editDrink');
  return new Promise((resolve, reject)=>{
    if (!reqBody.drinkName && !reqBody.drinkDesc) {
      return reject(AppErr.error400('Drink requires new name or address'));
    }

    Drink.findByIdAndUpdate(id, reqBody)
    .then(()=> Drink.findOne({_id: id})).then(resolve)
    .catch((err) => {
      return reject((AppErr.error404(err.message)));
    });
  });
};

//remove a drink
exports.removeDrink = function(id){
  debug('removeDrink');
  return new Promise((resolve, reject)=>{
    Drink.remove({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

//remove all drink
exports.removeAllDrinks = function(){
  return Drink.remove();
};
