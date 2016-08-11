var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
	receiver_id : {type : String,required : true},
	receiver_name : {type : String,required : true},
	receiver_email : {type : String,required : true},
	receiver_contact_number : {type : String,required : true},
	donator_id : {type : String,required : true},
	donator_name : {type : String,required : true},
	donator_email : {type : String,required : true},
	donator_contact_number : {type : String,required : true},
	donation_time : {type : Date},
	transaction_amount : {type : Number}

},{timestamps : true});

var Transaction = mongoose.model('Transaction',TransactionSchema);

module.exports = Transaction;