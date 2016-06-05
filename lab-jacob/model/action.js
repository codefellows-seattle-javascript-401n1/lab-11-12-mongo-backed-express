'use strict';

const mongoose = require('mongoose');

const actionSchema = mongoose.Schema({
  usePower: {type: Boolean},
  runAway: {type: Boolean}
});

module.exports = mongoose.model('action', actionSchema);
