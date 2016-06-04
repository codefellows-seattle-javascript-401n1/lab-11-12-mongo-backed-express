'use strict';

const mongoose  = require('mongoose');
const teamSchema = mongoose.Schema({
  name: {type: String, required: true},
  city: {type: String, required: true},
  captian: {type: mongoose.Schema.ObjectId}
});

module.exports = mongoose.model('team', teamSchema);
