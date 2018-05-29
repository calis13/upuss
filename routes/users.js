const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const config = require('../config/database');

//User Register Route
router.post('/register', function (req, res, next) {

  let newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, function(err, user){
    if(err){
      res.json({success: false, msg:'Failed to Register User'});
    }
    else{
      res.json({success: true, msg:'User Registered'});
    }
  });
});

//User Authenticate Route
router.post('/authenticate', function (req, res,next) {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 3600 // 1 hour login expiry
        });

        res.json({
          success: true,
          token: `JWT ${token}`,
          user:{
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      }
      else{
        return res.json({success: false, msg: 'Password incorrect'});
      }
    });
  });
});

//Profile Route
router.get('/profile', passport.authenticate('jwt', {session:false}), function (req, res) {
  res.json({user: req.user});
});

module.exports = router;