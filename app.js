const express = require('express');
const path = require('path');
const cors = require('cors'); //Allows request to API from diff domain
const bodyParser = require('body-parser'); //allows getting data from form
const passport = require('passport'); //Authentication
const mongoose = require('mongoose');

dotEnv = require('dotenv').config();

//DB Config
const config = require('./config/database');

//Connect to Mongoose
mongoose.connect(config.database) //creates database and connects
  .then(function () {
    console.log(`Connected to Database ${config.database}`);
  })
  .catch(function (err) {
    console.log(err);
  });

const app = express();

//Load routes
const users = require('./routes/users');
const newIdeas = require('./routes/newIdeas');
const voteIdeas = require('./routes/voteIdeas');
const game = require('./routes/game');

const port = process.env.PORT || 8080;

//Set static folder
app.use(express.static(path.join(__dirname, './public')));

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

require('./config/passport')(passport);

//Users routes
app.use('/users', users);

//Ideas routes
app.use('/newIdeas', newIdeas);
app.use('/voteIdeas', voteIdeas);

app.use('/game', game);

//Index Route
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

//Start Server
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});



