'use strict';

const debug = require('debug')('dm:encounterModel');
const mongoose = require('mongoose');

const encounterSchema = mongoose.Schema({
  name: {type: String, required: true},
  description: { type: String, required: true},
  cr: { type: Number, required: true},
  extra: {type: String}
});

module.exports = mongoose.model('encounters', encounterSchema);
