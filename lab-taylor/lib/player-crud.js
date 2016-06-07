'use strict';

const debug = require('debug')('soccer:player-crud');
const Player = require('../model/player');
const teamCrud = require('../lib/team-crud');
const AppError = require('./AppError');

exports.createPlayer = function (reqBody) {
  debug('creating player');
  return new Promise((resolve, reject) => {
    if (!reqBody.name) return reject(AppError.error400('players require a name'));
    if (!reqBody.hometown) return reject(AppError.error400('players require a hometown'));
    if (!reqBody.position) return reject(AppError.error400('players require a position'));
    if (!reqBody.number) return reject(AppError.error400('players require a number'));
    if (!reqBody.teamId) return reject(AppError.error400('players need to have a team'));

    reqBody.timestamp = new Date();
    const player = new Player(reqBody);
    player.save()
    .then(resolve)
    .catch(reject);
  });
};

exports.fetchPlayer = function(id) {
  debug('fetching player');
  return new Promise((resolve, reject) => {
    Player.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppError.error404(err.message)));
  });
};

exports.updatePlayer = function(id, reqBody) {
  debug('updating player');
  return new Promise((resolve, reject) => {
    if (Object.keys(reqBody).length === 0) return reject(AppError.error400('need to provide a body'));

    const playerKeys = ['name', 'hometown', 'number', 'position', 'teamId'];
    Object.keys(reqBody).forEach((key) => {
      if (playerKeys.indexOf(key) === -1) return reject(AppError.error400('need to update a key that exists'));
    });

    Player.findByIdAndUpdate(id, reqBody)
    .then(() => Player.findOne({_id: id}).then(resolve))
    .catch(err => reject(AppError.error404(err.message)));
  });
};

exports.removePlayer = function(id) {
  debug('removing player');
  return new Promise((resolve, reject) => {
    Player.remove({_id: id})
    .then(resolve)
    .catch(err => reject(AppError.error404(err.message)));
  });
};

exports.fetchPlayerByTeamId = function(teamId) {
  debug('finding players from team id');
  return new Promise((resolve, reject) => {
    teamCrud.fetchTeam({_id: teamId})
    .then(team => Player.find({teamId: team._id}))
    .then(players => resolve(players))
    .catch(err => reject(err));
  });
};

exports.fetchAll = function() {
  debug('fetching all players');
  return new Promise((resolve, reject) => {
    Player.find({})
    .then(players => resolve(players))
    .catch(err => reject(err));
  });
};

exports.removeAllPlayers = function() {
  debug('deleting all players');
  return Player.remove({});
};
