'use strict';
const mongoose = require('mongoose');

const brewSchema = mongoose.Schema({
  desc: {type: String, required: true},
  dueDate: {type: Date},
  brewerId: {type: mongoose.Schema.ObjectId, required: true}
});

module.exports = mongoose.model('brew', brewSchema);
