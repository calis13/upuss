const mongoose = require('mongoose');

const config = require('../config/database');

const Schema = mongoose.Schema;

const NewIdeaSchema = new Schema({
  name: String,
  description: String
});

const NewIdea = module.exports = mongoose.model('newIdea', NewIdeaSchema);