const express = require('express');
const path = require('path');
const cors = require('cors'); //Allows request to API from diff domain
const bodyParser = require('body-parser'); //allows getting data from form
const passport = require('passport'); //Authentication
const mongoose = require('mongoose');

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
//const games = require('./routes/games');

const port = process.env.PORT || 5000;

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//Use routes
app.use('/users', users);
//app.use('/games', ideas);

//Index Route
app.get('/', function (req, res) {
  res.send('Invalid Endpoint');
  //const title = 'Welcome';
  //res.render('index', {
  //  title: title
  //});
});

//Start Server
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});



