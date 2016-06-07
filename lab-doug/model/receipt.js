'use strict';
const mongoose = require('mongoose');

const receiptSchema = mongoose.Schema({
  customerLastName: {type: String, required: true},
  autoMake: {type: String, required: true},
  autoYear: {type: Number, required: true},
  repair: {type: String, required: true}
});

module.exports = mongoose.model('receipt', receiptSchema);
