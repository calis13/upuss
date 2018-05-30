const mongoose = require('mongoose');

const config = require('../config/database');

const Schema = mongoose.Schema;

const VoteIdeaSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  }
});

const VoteIdea = module.exports = mongoose.model('VoteIdea', VoteIdeaSchema);

module.exports.getIdeaByShortName = function (shortName, callback) {
  const query = { shortName: shortName }
  VoteIdea.findOne(query, callback);
}

module.exports.addVoteIdea = function (newVoteIdea, callback) {
  newVoteIdea.save(callback);
}