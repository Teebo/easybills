var passport = require('passport');
var User = require('../models/user.js');
var Donation = require('../models/donation.js');

exports.signUpUser = function(req,res){
	console.log("Request received");

	var newUser = new User();
	newUser.name = req.body.name;
	newUser.surname = req.body.surname;
	newUser.username = req.body.username;
	newUser.email = req.body.email;
	newUser.bank = req.body.bank;
	newUser.account_holder = req.body.accountHolder;
	newUser.account_number = req.body.accountNumber;
	newUser.contact_number = req.body.contactNumber;
	newUser.first_login = false;

	newUser.setPassword(req.body.password);



	newUser.save(function(err){
		if(err) {
			var validatorsObject = err;	

			var validatorErrors = {};
			console.log(validatorsObject);
			for(var key in validatorsObject){
				if(validatorsObject.hasOwnProperty(key)){
					console.log(key +" value is " + validatorsObject[key]);

					if(key == "errors"){

						var objErrors = validatorsObject[key];
							//console.log(typeof objErrors);
							var i = 1;
						for(var keyErrors in objErrors){
						if(objErrors.hasOwnProperty(keyErrors)){
							    
								console.log("Error Object ", i++);
								console.log("Key - ", keyErrors);

								switch (keyErrors){
									case "username":
									validatorErrors.username = objErrors[keyErrors].message;									
									break;

									case "email":
									validatorErrors.email = objErrors[keyErrors].message;																						
									break;

									case "account_number":
									validatorErrors.account_number = objErrors[keyErrors].message;									
									break;
									
									case "contact_number":
									validatorErrors.contact_number = objErrors[keyErrors].message;									
									break;																											
								}

						 		console.log(objErrors[keyErrors].message);	
						 	}
						  }
						console.log(validatorErrors);
					}else{
						console.log("We are looking at the wrong place");
					}
				}
			}
		

		
			// accNumberError = accNumberError.replace(/_/i,' ');		
			//contactNumberError = contactNumberError.replace(/_/i,' ');

		

			res.status(401).json(validatorErrors);	


			console.log("Something went wrong with saving the user in the DB");
		}else{
		var token;
			token = newUser.generateJwt();
			res.status(200);
			console.log("New user successfully saved");
			res.json({"token" : token});
		}

	
	});
};

exports.signInUser = function(req,res){

var currDate = new Date();
currDate.setHours(currDate.getHours() + 2);
var newDonation = new Donation({
      "name" : "Thabo	",
      "user_id" : "57abe409f63860c017ee1534",
      "surname" : "Ngubane",
      "email" : "ngubanethabo@gmail.com",
      "contact_number" : "0786190064",
      "bank" : "FNB",
      "account_number" : "2545845555",
      "account_holder" : "Himself",
      "amount_needed" : "3000",
      "time_posted" : currDate
});


newDonation.save(function(err){
   if(err){
      throw err;
   }

   console.log("Donated successfully");
});
//mmm
	console.log("Received login request");
	//If user is defined then it can be used to generate a JWT to be returned to the browser.
	passport.authenticate('local',function(err,UpdatedLoginUser,info){
		var token;
		//If password throws/catches an error
		if(err){
			console.log("Login error " + err);
			res.status(404).json(err);
			return;
		}

		//If a user is found
		if(UpdatedLoginUser){
			//user.first_login = true;
			//console.log("The login user is ",user.first_login);
			token = UpdatedLoginUser.generateJwt();
			res.status(200);
			res.json({
				"token" : token
			});
		}else{
			console.log("if user is not found ");
			res.status(404).json(info);
			//res.json({"logingStatus" : false});
		}
	})(req,res);
};


exports.profile = function(req,res){
	//If not user exists in the JWT return a 401
		console.log(req.payload);
	if(!req.payload._id){

		res.status(401).json({
			"message" : "UnauthorizedError : private profile"
		});
	}else{
		//Otherwise continue
		User.findById(req.payload._id,function(err,user){

			res.status(200).json(user);
		});
	}
};
