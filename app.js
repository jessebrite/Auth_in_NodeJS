var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var router = express.Router();
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var passport = require('passport'); // Passport
require('./config/passport')(passport); 
var logger = require('morgan'); // Morgan
var session = require('express-session'); // Session
var mongoose = require('mongoose'); // Mongoose
var configDB = require('./config/database.js'); // The Databse
// var MongoStore = require('connect-mongo')(session); // MongoStore session

// Connect to the DB
mongoose.connect(configDB.url, { useNewUrlParser: true }, function(err, client) {
  if (err) console.log(err); // If error, echo err
  console.log('Connection passed');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// passport requirements
app.use(
  session({
    secret: 'This_is_how_2_go_about_it',
    saveUninitialized: false,
    resave: true
  })
);
app.use(passport.initialize()); // Initializes passport
app.use(passport.session()); // persistent login sessions
app.use(flash()); // for flash messages stored in session

require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
