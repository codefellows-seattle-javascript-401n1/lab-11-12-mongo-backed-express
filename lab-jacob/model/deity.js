'use strict';

const mongoose = require('mongoose');

const deitySchema = mongoose.Schema({
  name: {type: String, required: true},
  power: {type: String, required: true}
});

module.exports = mongoose.model('deity', deitySchema);
