var Donation = require('../models/donation.js');
var PendingDonation = require('../models/pending_donation.js');


exports.getDonationUsers = function(req,res){

	Donation.find({user_id :{$ne : req.params.currUserID}},function(err,donationUsers){
		if(err){
			throw err;
		}
		console.log("Success fully returned donations");
		res.json(donationUsers);
	})
};

exports.getDonationUser = function(req,res){
	Donation.findOne({user_id : req.params.user_id},function(err,donationuser){
		if(err){
			throw err;
		}

		console.log("Successfully returned donation user");
		res.json(donationuser);
	})
};

exports.createDonation = function(req,res){

		var currentDate = new Date();
		const percentageRate = 0.6;
		var percentageIncrease = req.body.transaction.transaction_amount * percentageRate;
		var amountIncrease = parseInt(req.body.transaction.transaction_amount ) + percentageIncrease;

		var newDonation = new Donation({
		"user_id" : req.body.donatorUser._id,
		"name" : req.body.donatorUser.name,
		"surname" : req.body.donatorUser.surname,
		"email" : req.body.donatorUser.email,
		"contact_number" : req.body.donatorUser.contact_number,
		"bank" : req.body.donatorUser.bank,
		"account_number" : req.body.donatorUser.account_number,
		"account_holder" : req.body.donatorUser.account_holder ,
		"amount_needed" : amountIncrease,
		"time_posted" : currentDate
	});

		newDonation.save(function(err){
			if(err){throw err;}
			console.log("Successfully created the increase transaction");

			PendingDonation.findOneAndRemove(req.body.transaction.receiver_id,function(err){
					if(err){throw err;}

					console.log("Removed from pending,confirmed");
			});				
			
		});



	
	res.json({message : "Thank you"});
}