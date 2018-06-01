const mongoose = require('mongoose');

const config = require('../config/database');

const Schema = mongoose.Schema;

//Schema for Games
const GameSchema = new Schema({
  adminUsername: {
    type: String,
    required: true
  },
  adminEmail: {
    type: String,
    required: true
  },
  sport: {
    type: String,
    required: true
  },
  venue:{
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  playersRequired: {
    type: Number,
    required: true
  },
  refereesRequired: {
    type: Number,
    required: true
  },
  dateTime: {
    type: String,
    required:true
  }
});

const Game = module.exports = mongoose.model('Game', GameSchema);

//Get game by id to reduce required players
module.exports.getGameById = function (id, callback) {
  Game.findById(id, callback);
}
//Save new game
module.exports.addGame = function (newGame, callback) {
  newGame.save(callback);
}

