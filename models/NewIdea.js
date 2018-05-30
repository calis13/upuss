const mongoose = require('mongoose');

const config = require('../config/database');

const Schema = mongoose.Schema;

//Schema for users to suggest ideas
const NewIdeaSchema = new Schema({
  name: String,
  description: String
});

const NewIdea = module.exports = mongoose.model('newIdea', NewIdeaSchema);

//Prevent duplicate names
module.exports.getIdeaByName = function (name, callback) {
  const query = { name: name }
  NewIdea.findOne(query, callback);
}

//Save new idea
module.exports.addNewIdea = function (newIdea, callback) {
  newIdea.save(callback);
}