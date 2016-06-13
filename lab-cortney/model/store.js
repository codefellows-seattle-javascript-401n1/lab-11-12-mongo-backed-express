'use strict';

const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
  name: { type: String, required: true },
  store: { type: String, required: true },
  timestamp: { type: Date, required: true }
});

module.exports = mongoose.model('store', storeSchema);
