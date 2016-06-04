'use strict';

const debug = require('debug')('soccer:player-crud');
const Player = require('../model/player');
const AppError = require('./AppError');

exports.createPlayer = function (reqBody) {
  debug('creating player');
  return new Promise((resolve, reject) => {
    if (!reqBody.name) return reject(AppError.error400('players require a name'));
    if (!reqBody.hometown) return reject(AppError.error400('players require a hometown'));
    if (!reqBody.position) return reject(AppError.error400('players require a position'));
    if (!reqBody.number) return reject(AppError.error400('players require a number'));

    reqBody.timestamp = new Date();
    const player = new Player(reqBody);
    player.save()
    .then(resolve)
    .catch(reject);
  });
};

exports.fetchPlayer = function(id) {
  return new Promise((resolve, reject) => {
    Player.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppError.error404(err.message)));
  });
};
