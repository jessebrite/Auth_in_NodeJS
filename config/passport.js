const LocalStrategy = require('passport-local').Strategy;


// Load up the user model
const User = require('../models/user');

// Expose this function to the app using module.exports
module.exports = function(passport) {
	// PASSPORT SESSION
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
  	done(null, user.id);
  });

  // used to deserialise user
  passport.deserializeUser(function(id, done) {
  	user.findById(id, function(err, user) {
  		done(err, user);
  	});
  });

  // LOCAL SIGNUP
  passport.use('local-signup', new LocalStrategy({
  	fname : 'fname',
  	oname : 'oname',
  	lname : 'lname',
  	email : 'email',
  	password :  'password',
  	passReqToCallback : true // allows us to pass back the entire request to the callback
  },

  function(req, fname, oname, lname, email, password, done) {
  		// asynchronous
	   	// User.findOne wont fire unless data is sent back
	   	process.nextTick(function() {
	   		// Checjk if user already exists
	   		User.findOne({'local.email' : email}, function(err, user) {
	   			// If there're errors, return them
	   			if(err) {
	   				return done(err);
	   			}

	   			// If user already exists, return user
	   			if (user) {
	   				return done(null, false, 
	   					req.flash('signupMessage', 'That email already exists'));
	   			} else {
	   				// If there's no such user, create one
	   				const newUser = new User();

	   				// set user's local credentials
	   				newUser.local = {
	   					fname : fname,
	   					oname : oname,
	   					lname : lname,
	   					email : email,
	   					password : newUser.generateHash(password)
	   				}

	   				// Save user
	   				newUser.save(function(err) {
	   					if(err) {
	   						throw err;
	   					}
	   					return done(null, newUser)
	   				});
	   			};
	   		});
	   	});

  	}));

};