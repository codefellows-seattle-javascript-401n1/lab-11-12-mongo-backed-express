'use strict';

const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  desc: {type: String, required: true},
  dueDate: {type: String},
  content: {type: String, required: true}
});


module.exports = mongoose.model('task', taskSchema);
