'use strict';
const mongoose = require('mongoose');
const debug = require('debug')('business:receipt');

const receiptSchema = mongoose.Schema({
  customerLastName: {type: String, required: true},
  autoMake: {type: String, required: true},
  autoYear: {type: Number, required: true},
  repairName: {type: String, required: true},
  repairCost: {type: Number, required: true}
});
/*
syntax is mongoose.model(modelName, schema).  the modelName will be used as the mongo collection name.  The actual collection name will be modified by mongoose to make it plural('receipts')
*/
module.exports = mongoose.model('receipt', receiptSchema);
