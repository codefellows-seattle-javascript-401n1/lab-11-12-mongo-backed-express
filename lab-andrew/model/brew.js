'use strict';
const mongoose = require('mongoose');

const brewSchema = mongoose.Schema({
  desc: {type: String, required: true},
  dueDate: {type: Date},
  brewerId: {type: mongoose.Schema.ObjectId, required: true},
  brewOrigin: {type: String},
  roastDate: {type: String}
});


module.exports = mongoose.model('brew', brewSchema);
