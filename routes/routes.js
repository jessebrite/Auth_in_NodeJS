module.exports = function(router, passport) {

	// The homepage and its accompanying login links
	// Home route
	router.get('/', function(req, res) {
		res.render('index', {title: 'Home Page'});
	});

	// LOGIN
	// Get the login form
	router.get('/login', function(req, res) {
		res.render('login', {title: 'Login'}
			// , {message: req.flash('loginMessage') }
			);
	});

	// Process the login form
	// router.post('/login', do something);

	// SIGNUP
	// Get the signup form
	router.get('/signup', function(req, res) {
		res.render('signup', {title: 'Signup'}
			// , {message: req.flash('signupMessage') }
			);
	});

	// Process the signup form
	// router.post('/signup', do something);

	// PROFILE
	// This route is auth-protected
	// we will use route middleware to verify this (the isLoggedIn function)
	router.get('/profile', isLoggedIn, function(res, req) {
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
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated) {
		return next();
	}
	 // else, redirect them to the home page
  res.redirect('/');
}