'use strict';
const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
  description: {type:String, required:true},
  dueDate:{type: Date},
  noteId:{type: mongoose.Schema.ObjectId, required: true}
});

module.exports = mongoose.model('task', taskSchema);
