'use strict';

const mongoose = require('mongoose');

const heroSchema = mongoose.Schema({
  name: {type: String, required: true},
  timestamp: {type: Date, required: true},
  content: {type: String, required: true}
});

module.exports = mongoose.model('hero', heroSchema);
