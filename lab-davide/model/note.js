'use strict';

const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  name: {type: String, required: true},
  timestamp: Date,
  // timestamp: {type: Date, required: false},
  content: {type: String, required: true}
});


module.exports = mongoose.model('note', noteSchema);
