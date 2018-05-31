const express = require('express');
const router = express.Router();

const NewIdea = require('../models/NewIdea');
const config = require('../config/database');

//Get Ideas Route for Admin page
router.get('/ideas', function (req, res) {
  NewIdea.find().exec((err, allIdeas) => {
    res.json(allIdeas);
  });
});

//New Voting Idea Route (USER)
router.post('/add', function (req, res, next) {

  let newVoteIdea = new NewIdea({
    name: req.body.newIdeaName,
    description: req.body.newIdeaDescription
  });

  NewIdea.getIdeaByName(newVoteIdea.name, function (err, idea) {
    if (err) throw err;
    if (idea) {
      return res.json({ success: false, msg: 'Fundraiser name already Registered - please try again' });
    }

    NewIdea.addNewIdea(newVoteIdea, function (err, idea) {
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
  NewIdea.getIdeaByName(req.body.name, function (err, deleteIdea) {
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