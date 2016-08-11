var express = require('express');
var crypto = require('crypto');
var path = require('path');
var mailer = require('express-mailer');
require("./public/js/server_app/db");
var users = require("./public/js/server_app/middleware/user");
var donations = require("./public/js/server_app/middleware/donation");
var transactions = require("./public/js/server_app/middleware/transaction");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var ejs = require('ejs');
require("./public/js/server_app/config/passport");

//process.env.PORT lets port be set by Heroku or it will be 3000
var port = process.env.PORT  || 3000;

//JWTs can be digitally signed with a secret key. Doing so allows you to assert 
//that a token was issued by your server and was not maliciously modified.

//When verifying the token from the client side,if the secrets are not the same
//in here and in the models,it will give a UnauthorizedError: invalid signature

var jwt = require('express-jwt');
var auth = jwt({
	secret : 'MY_SECRET',
	userProperty : 'payload'
});

var app = express();

//Initializing passport as a middleware
app.use(passport.initialize());
//app.use('/',routesApi);

app.use(express.static(__dirname + "/public"));

app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');

//configure app to use bodyParser
//this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
  res.header("Access-Control-Allow-Methods","POST,GET,PUT,DELETE,OPTION");
  next();
});

app.use(function(err,req,res,next){
	 if(err.name === 'UnauthorizedError'){
	 		res.status(401);
	 		res.json({"message" : err.name + ":" + err.message});
	 }
});

mailer.extend(app, {
  from: 'themoolaClub.com',
  host: 'smtp.gmail.com', // hostname 
  secureConnection: true, // use SSL 
  port: 465, // port for secure SMTP 
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
  auth: {
    user: 'ngubanethabo.ambrose@gmail.com',
    pass: ''
  }
});
 
app.get('/',function(req,res){
  console.log("Landing page");
  res.end
});
app.post('/sign_up',users.signUpUser);
app.post('/sign_in',users.signInUser);
app.get('/profile',auth,users.profile);
app.get('/donate/:currUserID',donations.getDonationUsers);
app.get('/donate_to/:user_id',donations.getDonationUser);
app.post('/transaction',transactions.createTransaction);
app.get('/transactions/:_id',transactions.getTransactions);
app.delete('/transactions/cancel/:transactionID',transactions.cancelTransaction);
app.delete('/delete_success/transaction/:transactionID',transactions.deleteConfirmedTrans);
app.get('/confirm/transaction/:transactionID',transactions.getConfirmTransaction);
app.post('/confirm/transaction/new_donatee/:donatorID',donations.createDonation);

app.listen(port,function(){
	console.log("Server running at port 3000");
});
