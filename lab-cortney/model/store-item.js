'use strict';

const mongoose = require('mongoose');

const storeItemSchema = mongoose.Schema({
  item: { type: String, required: true },
  storeId: { type: mongoose.Schema.ObjectId, required: true }
});

module.exports = mongoose.model('storeItem', storeItemSchema)
