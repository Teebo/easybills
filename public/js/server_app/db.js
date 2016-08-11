var mongoose = require('mongoose');

//mongodb connection string
var dbURI = 'mongodb://Teebo:Thabo!123@ds153745.mlab.com:53745/easybills';

//connect to mongodb
mongoose.connect(dbURI);

//check if connected if not give error

mongoose.connection.on('err',function(err){
	console.log("Could not connect to mongoDB at " + dbURI);
	console.lo(err);
});

mongoose.connection.on('connected',function(){
	console.log("Successfully connected to mongo at " + dbURI);
});

mongoose.connection.on('disconnected',function(){
	console.log("MongoDB connection disconnected at " + dbURI);
}); 