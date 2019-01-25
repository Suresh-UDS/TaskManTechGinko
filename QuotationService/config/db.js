var mongoose = require('mongoose'), 
/* Uncomment for docker mongodb connection 
	mongoDB = require('mongodb'),   
	client = mongoDB.MongoClient, */
	fs = require('fs');

module.exports.init = function(config){
	console.log('Initializing Database')
	// var schemaFolder = __dirname+config.schema
	// mongoose connection for mongodb
	mongoose.connect(config.url, {server:{auto_reconnect:true}, user:config.user,pass:config.password});
	var db = mongoose.connection;

	db.on('error', function (err) {
	    console.error('MongoDB connection error:', err);
	});
	db.once('open', function callback() {
	    console.info('MongoDB connection is established');
	});
	db.on('disconnected', function() {
	    console.error('MongoDB disconnected!');
	    mongoose.connect(config.url, {server:{auto_reconnect:true}, user:config.user,pass:config.password});
	});
	db.on('reconnected', function () {
	    console.info('MongoDB reconnected!');
	});


	// Docker connection for Mongo Client
	/* Replace with mongoose connection for mongodb client */
	// client.connect("mongodb://config.user:config.password@localhost:27017/quotation_svc", {server: {auto_reconnect:true}} function(err, database) {
	  // Now you can use the database in the db variable
	//   if(err) throw err;
	//   var db = database;
	
	// });



	// fs.readdirSync(schemaFolder).forEach(function (file) {
	// 	if (~file.indexOf('.js')){
	// 		console.log('resigtering schema : '+file)
	// 		require(schemaFolder + '/' + file);
    //
	// 	}
	// });
}
