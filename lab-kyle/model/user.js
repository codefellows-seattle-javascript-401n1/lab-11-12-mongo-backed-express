'use strict';
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true},
  timestamp: {type: Date, required: true},
  email: {type: String, required: true}
});

module.exports = mongoose.model('user', userSchema);
