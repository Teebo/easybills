var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var donationSchema = new Schema({
	"user_id" : {type : String,require : true},
	"name" : {type : String,require : true},
	"surname" : {type : String,require : true},
	"email" : {type : String},
	"contact_number" : {type : String,min : 10,max : 10,required : true},
	"bank" : {type : String, required : true},
	"account_number" : {type : String, required : true},
	"account_holder" : {type : String} ,
	"amount_needed" : {type : Number, required : true},
	"time_posted" : {type : Date}

},{timestamps : true});

var Donation = mongoose.model('Donation',donationSchema);

module.exports = Donation;