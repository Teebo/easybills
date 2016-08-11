var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PendingDonationSchema = new Schema({
	"_id"  : {type : String},
	"user_id" :	{type : String,require : true},
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

var PendingDonation = mongoose.model('PendingDonation',PendingDonationSchema);

module.exports = PendingDonation;