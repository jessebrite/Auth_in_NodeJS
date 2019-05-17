module.exports = function(router, passport) {

	// The homepage and its accompanying login links
	// Home route
	router.get('/', function(req, res) {
		res.render('index', { title: 'Home Page' });
	});

	// LOGIN
	// Get the login form
	router.get('/login', function(req, res) {
		res.render('login',
				{title: 'Login', message: req.flash('loginMessage') }
			);
	});

	// Process the login form
	router.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// SIGNUP
	// Get the signup form
	router.get('/signup', function(req, res) {
		try {
			res.render('signup'
				, {title: 'Signup', message: req.flash('signupMessage')}
				);
			} catch(err) {
				console.log(err);
			}
	});

	// Process the signup form
	router.post('/signup', passport.authenticate('local-signup', {
		 successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// PROFILE
	// This route is auth-protected
	// we will use route middleware to verify this (the isLoggedIn function)
	router.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// LOGOUT
	router.get('logout', function(req, res) {
	  req.session.destroy();
	  req.logout();
	  res.status(401).redirect("/");
	});

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) { // Start of isLoggedIn()
	// Log session messages
  // console.log("req is ", Object.keys(req));
  // console.log("sessionID is ", req.sessionID);
  // console.log("session is", req.session);
  // console.log("session store is", req.sessionStore);

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated()) {
		return next();
	}
	 // else, redirect them to the home page
  res.redirect('/');
} // End of isLoggedIn()