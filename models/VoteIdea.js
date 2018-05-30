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
  }
});

// const VotesSchema = new Schema({
//   name: Number
// });

// const IdeasSchema = new Schema([
//    {
//       name: 'Raffle',
//       shortName: 'raffle',
//       description: 'We can sell tickets to the local community'
//     },
//     {
//       name: 'Charity Match',
//       shortName: 'football',
//       description: 'Football match with $2 entry tickets',
//     },
//     {
//       name: 'Carwash',
//       shortName: 'cars',
//       description: 'Wash cars for $5 each',
//     },
//     {
//       name: 'Dog Wash',
//       shortName: 'dogs',
//       description: "Everyone loves dogs! Let's wash them for $$$'s!",
//     },
// ]);

// const VotesSchema = new Schema({
//     raffle: 54,
//     football: 32,
//     cars: 12,
//     dogs: 18,
//   });

const VoteIdea = module.exports = mongoose.model('VoteIdea', VoteIdeaSchema);
// const Votes = module.exports = mongoose.model('Votes', VotesSchema);

module.exports.getIdeaByShortName = function (shortName, callback) {
  const query = { shortName: shortName }
  VoteIdea.findOne(query, callback);
}

module.exports.addVoteIdea = function (newVoteIdea, callback) {
  newVoteIdea.save(callback);
}