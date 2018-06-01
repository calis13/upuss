const mongoose = require('mongoose');

const config = require('../config/database');

const Schema = mongoose.Schema;

//Schema for Players in Game
const GamePlayersSchema = new Schema({
  adminUsername: {
    type: String,
    required: true
  },
  gameID: {
    type: String,
    required: true
  },
  playerUsername: {
    type: String,
    required: true
  },
  playerRole: {
    type: String,
    required: true
  }
});

const GamePlayers = module.exports = mongoose.model('GamePlayers', GamePlayersSchema);

//Save new game
module.exports.addGame = function (newGame, callback) {
  newGame.save(callback);
}
//Save new game player
module.exports.addGamePlayer = function (newGamePlayers, callback) {
  newGamePlayers.save(callback);
}

//Get game by id to reduce required players
module.exports.getGameById = function (id, callback) {
  GamePlayers.findById(id, callback);
}
