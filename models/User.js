const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const config = require('../config/database');

const Schema = mongoose.Schema;

//Create User Schema
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  // university: {
  //   type: String
  // },
  // interests: [
  //   { sport: basketball, selected:false},
  //   { sport: baseball, selected:false},
  //   { sport: softball, selected:false},
  //   { sport: cricket, selected:false},
  //   { sport: football, selected:false},
  //   { sport: soccer, selected:false}
  // ]
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByUsername = function (username, callback) {
  const query = { username: username }
  User.findOne(query, callback);
}

module.exports.getUserByEmail = function (email, callback) {
  const query = { email: email }
  User.findOne(query, callback);
}

module.exports.addUser = function (newUser, callback) {
  //encrypt password
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback)
    });
  });
}

module.exports.comparePassword = function (enteredPassword, hash, callback) {
  bcrypt.compare(enteredPassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
}