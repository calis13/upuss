const mongoose = require('mongoose');

const config = require('../config/database');

const Schema = mongoose.Schema;

//Schema for current voting options
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

//Ensures no duplicate short names
module.exports.getIdeaByShortName = function (shortName, callback) {
  const query = { shortName: shortName }
  VoteIdea.findOne(query, callback);
}

//Save new idea
module.exports.addVoteIdea = function (newVoteIdea, callback) {
  newVoteIdea.save(callback);
}
