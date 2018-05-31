const express = require('express');
const router = express.Router();
const Pusher = require('pusher');
dotEnv = require('dotenv').config();

const VoteIdea = require('../models/VoteIdea');
const config = require('../config/database');

const pusher = new Pusher({
  appId: '534219',
  key: '901eb88fc540343e1602',
  secret: '7911d6518af19e983749',
  cluster: 'ap1',
  encrypted: true,
});

//Voting route
router.post('/vote', (req, res) => {
  const { body } = req;
  const idea = body.name;

  VoteIdea.getIdeaByShortName(idea, function (err, voteUp) {
    if (err) {
      return res.json({ success: false, msg: 'Could not find idea' });
    };

    voteUp.votes = voteUp.votes + 1;

    voteUp.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Could not update idea' });
      }

      pusher.trigger('vote-channel', 'vote',
        idea,
      );
      res.json(idea);
    });
  });
});

//Reset route
router.post('/reset', (req, res) => {
  const idea = req.body.shortName;

  VoteIdea.getIdeaByShortName(idea, function (err, voteReset) {
    if (err) {
      return res.json({ success: false, msg: 'Could not find idea' });
    };

    voteReset.votes = 0;
    voteReset.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Could not reset votes' });
      }
      return res.json({ success: true, msg: 'Votes reset!' });
    });
  });
});

//Get Ideas Route
router.get('/ideas', function (req, res) {
  VoteIdea.find().exec((err, ideas) => {
    res.json(ideas);
  });
});

//Get Votes Route
router.get('/votes', function (req, res) {
  VoteIdea.find().exec((err, ideas) => {
    let votes = Object;
    for (i = 0; i < ideas.length; i++) {
      votes[i] = { [ideas[i].shortName]: ideas[i].votes };
    }
    res.json(Object.values(votes));
  });
});

//New Voting Idea Route (ADMIN)
router.post('/add', function (req, res, next) {

  let newVoteIdea = new VoteIdea({
    name: req.body.voteIdeaName,
    shortName: req.body.voteIdeaShortName,
    description: req.body.voteIdeaDescription
  });

  VoteIdea.getIdeaByShortName(newVoteIdea.shortName, function (err, idea) {
    if (err) throw err;
    if (idea) {
      return res.json({ success: false, msg: 'Fundraiser already Registered' });
    }

    VoteIdea.addVoteIdea(newVoteIdea, function (err, idea) {
      if (err) {
        res.json({ success: false, msg: 'Failed to Register Idea' });
      }
      else {
        res.json({ success: true, msg: 'Idea Registered' });
      }
    });
  });
});

//Delete Idea from database
router.put('/remove', function (req, res, next) {
  VoteIdea.getIdeaByShortName(req.body.shortName, function (err, deleteIdea) {
    if (err) {
      return res.json({ success: false, msg: 'Could not find idea' });
    };
    deleteIdea.remove(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Could not delete idea' });
      }
      return res.json({ success: true, msg: 'Idea Deleted!' });
    });
  });
});

module.exports = router;