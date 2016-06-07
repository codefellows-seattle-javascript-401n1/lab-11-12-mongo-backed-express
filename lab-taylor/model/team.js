'use strict';

const mongoose  = require('mongoose');
const teamSchema = mongoose.Schema({
  name: {type: String, required: true},
  city: {type: String, required: true},
  coach: {type: String, required: true}
});

module.exports = mongoose.model('team', teamSchema);
