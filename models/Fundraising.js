const mongoose = require('mongoose');
const config = require('../config/database');

const Schema = mongoose.Schema;

//Create User Schema
const FRSchema = new Schema({
  month: String,
  choices:[
    {
      value: String,
      votes: Number
    }
  ]
});

const Fundraiser = module.exports = mongoose.model('Fundraiser', FRSchema);