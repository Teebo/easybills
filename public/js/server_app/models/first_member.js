exports.firstDonar = function(){
var currDate = new Date();
var newDonation = new Donation({
      "name" : "Alex",
      "surname" : "Mntambo",
      "email" : "alex@gmail.com",
      "contact_number" : "0124547854",
      "bank" : "Standard",
      "account_number" : "7845121454878",
      "account_holder" : "Himself",
      "amount_needed" : "4000",
      "time_posted" : currDate
});


newDonation.save(function(err){
   if(err){
      throw err;
   }

   console.log("Donated successfully");
});
};
