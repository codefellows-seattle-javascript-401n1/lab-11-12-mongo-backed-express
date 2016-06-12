'use strict';
//debug
const debug = require('debug');
//mongoose
const mongoose = require('mongoose');
//drink model 'Drink'
const Drink = require('../model/drink');
//cafeCrud
const cafeCrud = require('./cafe-crud');
//app-error
const AppErr = require('./app-error');

//create a drink
exports.createDrink = function(reqBody){
  return new Promise((resolve, reject)=>{
    if(!reqBody.drinkName && !reqBody.drinkDesc && !reqBody.locId){
      return AppErr.error400('drink requires name, description, and location id');
    }

    const drink = new Drink(reqBody);
    drink.save()
    .then(drink => resolve(drink))
    .catch(err => reject(err));
  });
};

//get/fetch a drink

//update a drink

//remove a drink

//remove all drink
