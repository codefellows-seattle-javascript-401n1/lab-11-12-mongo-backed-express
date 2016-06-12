'use strict';

const mongoose = require('mongoose');

const drinkSchema = mongoose.Schema({
  drinkName: {type: String, required: true},
  drinkDesc: {type: String, required: true},
  locationId: {type: mongoose.Schema.ObjectId, required: true}
});

module.exports = mongoose.model('drink', drinkSchema);
