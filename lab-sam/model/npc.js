'use strict';

const mongoose = require('mongoose');

const npcSchema = mongoose.Schema({
  encounterId: {type: mongoose.Schema.ObjectId, required: true},
  name: {type: String, required: true},
  race: { type: String, required: true},
  classes: {type: String, required: true},
  description: { type: String}
});

module.exports = mongoose.model('npc', npcSchema);
