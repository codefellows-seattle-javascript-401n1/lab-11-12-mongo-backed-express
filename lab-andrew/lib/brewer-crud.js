'use strict';

const Brewer = require('../model/brewer');
const AppErr = require('../lib/app-error');
// const debug = require('debug')('brewer:brewer-crud');

exports.createBrewer = function(reqBody) {
  return new Promise((resolve, reject) => {
    if(!reqBody.content)
      return reject(AppErr.error400('Brewer requires content'));
    if(!reqBody.name)
      return reject(AppErr.error400('Brewer requires a name'));

    reqBody.timestamp = new Date();
    const brewer = new Brewer(reqBody);
    brewer.save()
    .then(resolve)
    .catch(reject);
  });
};

exports.fetchBrewer = function(id) {
  return new Promise((resolve, reject) => {
    Brewer.findOne({_id: id})
    .then(resolve)
    .catch(err =>
    reject(AppErr.error404(err.message)));
  });
};

exports.removeAllBrewers = function() {
  return Brewer.remove({});
};
