// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User = require('../models/user');

// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) { // startt of function(passport)

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          done(err, user);
      });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({ // start of signup LocalStrategy
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {

      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() { // Start of nextTick()

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.email' :  email }, function(err, user) { // Start user request
          // if there are any errors, return the error
          if (err)
              return done(err);

          // check to see if theres already a user with that email
          if (user) {
              return done(null, false, req.flash('signupMessage', 'Sorry, this email is already taken.'));
          } else {

              // if there is no user with that email
              // create the user
              var newUser = new User();

              // set the user's local credentials
              newUser.local = {
                email : email,
                password : newUser.generateHash(password), 
              };

              // save the user
              newUser.save(function(err) {
                  if (err)
                      throw err;
                  return done(null, newUser);
              });
          }

      }); // End of user request  

    }); // End of nextTick

  })); // end of signup LocalStragegy

   // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({ // start of login LocalStrageg
  	usernameField : 'email',
  	passwordField : 'password',
  	passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {
  	// find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({'local.email' : email}, function(err, user) { // start of find user
    	// if there are any errors, return the error before anything else
    	if(err) {
    		return done(err);
        console.log('Wrong input');
    	}
    	if(!user) {
    		return done(null, false, req.flash('loginMessage', 'Sorry, user does not exist'));
    	}
    	// if the user is found but the password is wrong
    	if(!user.validPassword(password)) {
    		return done(null, false, req.flash('loginMessage', 'Username and password do not match'));
    	}
    	// If all conditions are met, return user
    	return done(null, user);
    }); // end of find user

  })); // end of login LocalStragegy

  // =========================================================================
  // GOOGLE ==================================================================
  // =========================================================================
  passport.use(new GoogleStrategy({
    clientID : configAuth.googleAuth.clientID,
    clientSecret : configAuth.googleAuth.clientSecret,
    callbackURL : configAuth.googleAuth.callbackURL,
    },    
    function(token, refreshToken, profile, done) {
      // make the code asynchronous
      // User.findOne won't fire until we have all our data back from Google
      process.nextTick(function() {
        // try to find the user based on their google id
        User.findOne({'google.id' : profile.id}, function(err, user) {
          if (err) {
            return done(err);
          }

          // if a user is found, log them in
          if(user) {
            return done(null, user);
          } else { // else if the user isn't in our database, create a new user
              var newUser = new User();

               // set all of the relevant information
               newUser.google = {
                id : profile.id,
                token : token,
                name : profile.displayName,
                email : profile.emails[0].value // pull the first email
              }

              // persist the user
              newUser.save(function(err) {
                if (err) {
                  throw err;
                }
                return done(null, newUser);
              })
          }
        })
      })
    }
  ));
      

}; // end of function(passport)