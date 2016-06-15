'use strict';
const mongoose = require('mongoose');
const debug = require('debug')('business:receipt');

const receiptSchema = mongoose.Schema({
  customerLastName: {type: String, required: true},
  autoMake: {type: String, required: true},
  autoYear: {type: Number, required: true}
});
/*
Compiling a schema (collection) into a Model (an instance constructor  based on the schema). All docuemnt creation and retrieval are absed on these models. The syntax is mongoose.model(modelName, schema). The model() constructs an instance of schema.  The modelName will be used as the mongo collection name.  The actual collection name will be modified by mongoose to make it plural('receipts')
*/
module.exports = mongoose.model('receipt', receiptSchema);
