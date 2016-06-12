'use strict';

const mongoose = require('mongoose');

const beliefSchema = mongoose.Schema({
  name: {type: String, required: true},
  desc: {type: String, required: true},
  deityId: {type: mongoose.Schema.ObjectId, required: true}
});

module.exports = mongoose.model('belief', beliefSchema);
