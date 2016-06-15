'use strict';
const mongoose = require('mongoose');
const debug = require('debug')('business:receipt');

/*
this is the mongoose specific constructor for an instance of a mongo document that is formatted the way we specify in the constructor and will be placed in the collection (receipt) we specify in our mongoose.model function at the bottom of the page
*/
const receiptSchema = mongoose.Schema({
  customerLastName: {type: String, required: true},
  autoMake: {type: String, required: true},
  autoYear: {type: Number, required: true}
});
/*
          mongoose.model(modelName, schema)
Registering a schema into a collection/model. Everytime after we define this and call receiptSchema to build another instance of a mongo document, the new document  will be placed in this collection/model.  All document creation and retrievals in mongoose are based on models. The syntax is mongoose.model(modelName, schema). The model() constructs an instance of schema.  The modelName will be used as the mongo collection name.  The actual collection name will be modified by mongoose to make it plural('receipts')
*/
module.exports = mongoose.model('receipt', receiptSchema);
