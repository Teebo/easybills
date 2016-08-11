var Transaction = require('../models/transaction.js');
var Donation = require('../models/donation.js');
var PendingDonation = require('../models/pending_donation.js');
var User = require('../models/user.js');
var mailer = require('express-mailer');


exports.createTransaction = function(req,res){

console.log("Received transasction post ");
console.log("The request body " + JSON.stringify(req.body,null,'\t'));

var pendingDonAmount = req.body.transaction_amount;
var amountRemainder = req.body.original_amount - req.body.transaction_amount; 

var newTransaction = new Transaction({
	"receiver_id" : req.body.receiver_id,
	"receiver_name" : req.body.receiver_name,
	"receiver_email" : req.body.receiver_email,
	"receiver_contact_number" : req.body.receiver_contact_number,
	"donator_id" : req.body.donator_id,
	"donator_name" : req.body.donator_name,
	"donator_email" : req.body.donator_email,
	"donator_contact_number" : req.body.donator_contact_number,
	"donation_time" : req.body.donation_time,
	"transaction_amount" : req.body.transaction_amount

});

newTransaction.save(function(err,transaction){
	if(err){throw err;}

	console.log("Successfully saved transaction " + JSON.stringify(req.body,null,'\t'));

	res.mailer.send('email',{
		to :'ngubanethabo.ambrose@gmail.com',
		subject : 'Test Email'
	},function(err){
		if(err){
			console.log(err);
			console.log("There was an error sending the mail");
		}else{
			console.log("Successfully sent email");
		}
	})	
	
//Find the user being donated to and remove it in the listings/donations collection(Only if donation amount needed is fullfilled)
//and then insert it in a temporary table so that if the user didn't receive
//the donation within the required time(4 hours) OR the donator/donatee decided to 
//cancel the transation,then we can put back that donatee in the donations/listings collection

if(amountRemainder <= 0){
	Donation.findOneAndRemove({user_id : req.body.receiver_id},function(){
		if(err){throw err;}
		console.log("Successfully removed fullfilled donation");
	})

}else{
	Donation.find({user_id : req.body.receiver_id},function(err,user){

		if(err){throw err;}
		console.log("The user being donated to " + user);
	
	var currentDate = new Date();
	currentDate.setHours(currentDate.getHours() + 2);  	

	var newPendingDonation = new PendingDonation({
	"_id" : user[0]._id,
	"user_id" : user[0].user_id,	
	"name" : user[0].name,
	"surname" : user[0].surname,
	"email" : user[0].email,
	"contact_number" : user[0].contact_number,
	"bank" : user[0].bank,
	"account_number" : user[0].account_number,
	"account_holder" : user[0].account_holder,
	"amount_needed" : pendingDonAmount,
	"time_posted" : currentDate

});

newPendingDonation.save(function(err,pendingUser){

	if(err){throw err;}

	console.log("Successfully saved user in pending donations collection");
	Donation.findOneAndUpdate({user_id : req.body.receiver_id},{amount_needed : amountRemainder},function(err,donation){
			if(err) {throw err;};

			console.log("Successfully updated donation needed amount ", donation); 
	})

});	
});
}
//End of that 


res.json(transaction);	
});


};


exports.getTransactions = function(req,res){
	console.log("Received donations request");



	Transaction.find({$or : [{receiver_id : req.params._id},{donator_id : req.params._id}]},function(err,transactions){
		if(err){
			throw err;
		}

		console.log("Operation should start here");
		transactions.forEach(function(obj,index){
			if (obj.receiver_id == req.params._id || obj.donator_id == req.params._id){

				var hours = obj.donation_time.getHours();
				var day = obj.donation_time.getDate();
				var month = obj.donation_time.getMonth();
				var year = obj.donation_time.getYear();

				var currentDate = new Date();
				var afterFourHour = currentDate.getHours();
				var checkDay = currentDate.getDate(); 
				var checkMonth = currentDate.getMonth();
				var checkYear = currentDate.getYear();

				var timeElapsed = afterFourHour - hours;

				if(timeElapsed >= 1 || checkDay > day || checkMonth > month || checkYear > year){
					

					PendingDonation.find({user_id : obj.receiver_id},function(err,donatee){
						if(err) {throw err;}
						console.log("Found the temp user " + donatee);


					});

					PendingDonation.findOneAndRemove({user_id : obj.receiver_id},function(err){
						if(err){throw err;}

						console.log("Deleted pending donations");
					});
				
				}else{
					console.log("Operation not performed due to unmet time conditions (4 Hours not Elapsed)");
				}
			}else{
				console.log("Transaction users not matched");
			}
		});

		console.log("Operation should end here");

		

		res.json(transactions);

	});
};

exports.cancelTransaction = function(req,res){

Transaction.find({_id : req.params.transactionID},function(err,transaction){

		if(err){throw err;}

		console.log("pending want to remove " + transaction[0].receiver_id);

		PendingDonation.findOneAndRemove(transaction.receiver_id,function(err){
				if(err){throw err}
				console.log("It was removed in the pending also");
		});

});

Transaction.findOneAndRemove({_id : req.params.transactionID},function(err){
	if(err){throw err;}
	console.log("Successfully permanently cancelled the transaction");

	res.json({message : "Successfully permanently cancelled the transaction"});	
})

	
};


exports.getConfirmTransaction = function(req,res){
	console.log("Received confirm request");
	Transaction.find({_id : req.params.transactionID},function(err,transaction){
		if(err){throw err;}
		User.find({_id : transaction[0].donator_id},function(err,user){
			if(err){throw err;}
			console.log("Got donation user");
			res.json({transaction : transaction,user : user});
		})

	});
/*
	Transaction.findOneAndRemove({_id : req.params.transactionID},function(err){
		if(err) {throw err;}
		console.log("Successfully removed confirmed transaction");
	});

 */
};

exports.deleteConfirmedTrans = function(req,res){
	Transaction.findOneAndRemove({_id : req.params.transactionID},function(err){
		if(err) {throw err;}
		console.log("Successfully removed confirmed transaction");
	});
	res.json({message : "Successfully deleted confirmed transaction"});
}
