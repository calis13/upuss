const express = require('express');
const router = express.Router();

const Game = require('../models/Game');
const GamePlayers = require('../models/GamePlayers');
const config = require('../config/database');

//Get All Games Route for Admin page
router.get('/getGames', function (req, res) {
  Game.find().exec((err, allGames) => {
    res.json(allGames);
  });
});

//Get All Games by for users > 0 players and refs required 
router.get('/gameAvailable', function (req, res) {
  Game.find({ $or: [{ playersRequired: { $gt: 0 } }, { refereesRequired: { $gt: 0 } }] }).exec((err, availableGames) => {
    res.json(availableGames);
  });
});

//Get All Game Players Route for views
router.get('/gamesPlayers', function (req, res) {
  GamePlayers.find().exec((err, allPlayers) => {
    res.json(allPlayers);
  });
});

//New Game Route
router.post('/newGame', function (req, res, next) {
  let newGame = new Game({
    adminUsername: req.body.newGameAdminUsername,
    adminEmail: req.body.newGameAdminEmail,
    sport: req.body.newGameSport,
    venue: req.body.newGameVenue,
    description: req.body.newGameDescription,
    playersRequired: req.body.newGamePlayersRequired,
    refereesRequired: req.body.newGameRefereesRequired,
    dateTime: req.body.newGameDateTime
  });

  Game.addGame(newGame, function (err, game) {
    if (err) {
      res.json({ success: false, msg: 'Failed to Add Game' });
    }
    else {
      res.json({ success: true, msg: 'Game Successfully Added' });
    }
  });
});

//Delete Game from database
router.put('/remove', function (req, res, next) {
  Game.getGameById(req.body._id, function (err, deleteGame) {
    if (err) {
      return res.json({ success: false, msg: 'Could not find game' });
    };
    deleteGame.remove(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Could not delete game' });
      }
      var id = req.body._id;
      GamePlayers.remove({ gameID: id }, function (err, response) {
        if (err) {
          return res.json({ success: false, msg: 'Could not delete game' });
        }
        return res.json({ success: true, msg: 'You have been removed!' });
      });
    });
  });
});

//Game Update Route
router.put('/update', function (req, res, next) {
  Game.getGameById(req.body._id, function (err, game) {
    if (err) {
      return res.json({ success: false, msg: 'Could not find game' });
    };

    var sport = req.body.sport
    var venue = req.body.venue.trim()
    var description = req.body.description.trim()
    var playersRequired = req.body.playersRequired
    var refereesRequired = req.body.refereesRequired
    var dateTime = req.body.dateTime.trim()

    game.sport = sport;
    game.venue = venue;
    game.description = description;
    game.playersRequired = playersRequired;
    game.refereesRequired = refereesRequired;
    game.dateTime = dateTime;

    game.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Could not update game' });
      }
      return res.json({ success: true, msg: 'Game Updated' });
    });
  });
});

//Player quit game route
router.put('/removeFromGame', function (req, res, next) {
  var player = req.body.player
  var gameID = req.body.gameID
  var playerRole = req.body.playerRole

  GamePlayers.find({ $and: [{ playerUsername: player }, { gameID: gameID }] }).exec((err, playerRow) => {
    for (row in playerRow) {
      playerRow[row].remove(function (err) {
        if (err) {
          return res.json({ success: false, msg: 'Could not delete player from game' });
        }
      })
    }
  });

  //increment player or referee
  Game.getGameById(gameID, function (err, playerQuit) {
    if (err) {
      return res.json({ success: false, msg: 'Could not find game' });
    };
    if (playerRole == 'referee') {
      playerQuit.refereesRequired = playerQuit.refereesRequired + 1;
    }
    else {
      playerQuit.playersRequired = playerQuit.playersRequired + 1;
    }
    playerQuit.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Could not add player/referee back into game' });
      }
      return res.json({ success: true, msg: 'Player Removed from Game!' });
    });
  });
});


//Player join game route
router.post('/joinGame', function (req, res, next) {
  let newGamePlayer = new GamePlayers(req.body);

  GamePlayers.addGamePlayer(newGamePlayer, function (err, game) {
    if (err) {
      res.json({ success: false, msg: 'Failed to Join Game' });
    }
    //decrement player or referee
    Game.getGameById(newGamePlayer.gameID, function (err, playerJoin) {
      if (err) {
        return res.json({ success: false, msg: 'Could not find game' });
      };
      if (newGamePlayer.playerRole == 'referee') {
        playerJoin.refereesRequired = playerJoin.refereesRequired - 1;
      }
      else {
        playerJoin.playersRequired = playerJoin.playersRequired - 1;
      }
      playerJoin.save(function (err) {
        if (err) {
          return res.json({ success: false, msg: 'Could not subtract player/referee from game totals' });
        }
        res.json({ success: true, msg: 'You have joined! Good Luck!' });
      });
    });
  });
});

module.exports = router;