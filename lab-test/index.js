'use strict';

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/example';
const mongoose = require('mongoose');
mongoose.connect(mongoURI);

const exampleSchema = mongoose.Schema({
  content: String
});

const Example = mongoose.model('example', exampleSchema);

exports.createExample = function(data){
  return new Example(data).save();
};

exports.fetchExample = function(id){
  return Example.findOne({_id: id});
};

