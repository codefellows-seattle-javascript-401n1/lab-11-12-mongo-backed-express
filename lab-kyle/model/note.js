'use strict';

const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  name: { type: String, required: true},
  timestamp: {type: Date, required: true},
  content: {type: String, required: true},
  userId: {type: mongoose.Schema.ObjectId, required: true}
});

module.exports = mongoose.model('note', noteSchema);
