'use strict';

const mongoose = require('mongoose');
const playerSchema = mongoose.Schema({
  name: {type: String, required: true},
  hometown: {type: String, required: true},
  position: {type: String, required: true},
  number: {type: Number, required: true},
  timestamp: {type: Date, required: true}
});

module.exports = mongoose.model('player', playerSchema);
