const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
const userSchema = mongoose.Schema({
	local : {
		fname : String,
		oname : String,
		lname : String,
		email : String,
		password: String,
	},
	facebook : {
		id : String,
		token: String,
		name : String,
		email: String,
	},
	google           : {
        id : String,
        token : String,
        email : String,
        name : String
    }

});

// Generating a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};