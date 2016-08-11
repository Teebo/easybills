var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var uniqueValidator = require("mongoose-unique-validator");

//used to create, sign, and verify tokens
var jwt = require('jsonwebtoken');

var userSchema = new Schema({
	"name" : {type : String, min : 3, max : 10,required : true},
	"surname" : {type : String, min : 3, max : 10,required : true},
	"username" : {
		type : String, 
		min : 3, 
		max : 10,
		unique : true,
		required : true},
	"email" : {type : String, required : true,unique : true},
	"bank" : {type : String, required : true},
	"account_holder" : {type : String, required : true},
	"account_number" : {type : String, required : true,unique : true},
	"contact_number" : {type : String, required : true,min : 3, max : 10,unique : true},
	"first_login" : {type : Boolean},
	"hash" : String,
	"salt" : String

},{timestamps : true});

userSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64).toString('hex');
};


//The validPassword returns a boolean value,
//If the hash we create in this function is the same as the one we had
//saved when registering the user,return true otherwise return false

userSchema.methods.validPassword = function(password){
	var hash = crypto.pbkdf2Sync(password,this.salt,1000,64).toString('hex');
	return this.hash === hash;
};

userSchema.methods.generateJwt = function(){
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jwt.sign({
		_id : this.id,
		email : this.email,
		first_login : this.first_login,
		name : this.name,
		surname : this.surname,
		contact_number : this.contact_number,
		exp : parseInt(expiry.getTime() / 1000)
	}, "MY_SECRET");
};

/*userSchema.pre('save',function(next){

	var user = this;

	user.setPassword(user.password);
	next();
});*/

userSchema.plugin(uniqueValidator,{message : "There is already a user with {PATH}"});

var User = mongoose.model('User',userSchema);

module.exports = User;