'use strict';
const mongoose = require('mongoose');

const repairSchema = mongoose.Schema({
  mechanicLastName: {type: String, required: true},
  repairName: {type: String, required: true},
  laborCost: {type: Number, required: true},
  partsCost: {type: Number, required: true},
  receiptId: {type: mongoose.Schema.ObjectId, required:true}
});

module.exports = mongoose.model('repair', repairSchema);
