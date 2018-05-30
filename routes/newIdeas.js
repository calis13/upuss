const express = require('express');
const router = express.Router();

const newIdea = require('../models/NewIdeas');
const config = require('../config/database');

//Ideas Route
router.get('/newIdeas', function (req, res) {
  console.log('HERE');
  res.json({ ideas: req.ideas });
});

module.exports = router;