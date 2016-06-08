'use strict';

const mongoose = require('mongoose');

const powerSchema = mongoose.Schema({
  power: { type: String, required: true},
  weakness: { type:String, required: false},
  heroId: { type: mongoose.Schema.ObjectId, required: true}
});

module.exports = mongoose.model('power', powerSchema);
