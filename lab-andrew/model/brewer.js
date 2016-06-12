'use strict';

const mongoose = require('mongoose');

const brewerSchema = mongoose.Schema({
  name: {type: String, required: true},
  timestamp: {type: Date, required: true},
  content: {type: String, required: true}
});

module.exports = mongoose.model('brewer', brewerSchema);
