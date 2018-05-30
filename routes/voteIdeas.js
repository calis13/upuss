const express = require('express');
const router = express.Router();

const VoteIdea = require('../models/VoteIdea');
const config = require('../config/database');

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

//New FR Idea Route
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

module.exports = router;