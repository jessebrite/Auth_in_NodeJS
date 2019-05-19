var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
const userSchema = mongoose.Schema({
	local : {
		// fname : {
		// 	type : String,
		// 	required : true,
		// 	trim : true
		// },
		// oname : {
		// 	type : String,
		// 	required : false,
		// 	trim : true
		// },
		// lname : {
		// 	type: String,
		// 	required : true,
		// 	trim : true
		// },
		email: {
	    type: String,
	    unique: true,
	    required: true,
	    trim: true
	  },
	  password: {
	    type: String,
	    required: true,
	  }
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

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);