'use strict';
//debug
const debug = require('debug')('drink:drink-crud');
//mongoose
const mongoose = require('mongoose');

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
exports.fetchDrink = function(id){
  debug('fetchDrink');
  return new Promise((resolve, reject) =>{
    Drink.findOne({_id: id})
    .then(drink => resolve(drink))
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

//update a drink

//remove a drink

//remove all drink
exports.removeAllDrinks = function(){
  return Drink.remove();
};
