'use strict';

const mongoose = require('mongoose');

const cafeSchema = mongoose.Schema({
  cafeName: {type: String, required: true},
  cafeAdd: {type: String, required: true}
});

module.exports = mongoose.model('cafe', cafeSchema);
