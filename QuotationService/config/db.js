var mongoose = require('mongoose'), 
	fs = require('fs');

    

module.exports.init = function(config){
	console.log('Initializing Database')
	// var schemaFolder = __dirname+config.schema
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

	// fs.readdirSync(schemaFolder).forEach(function (file) {
	// 	if (~file.indexOf('.js')){
	// 		console.log('resigtering schema : '+file)
	// 		require(schemaFolder + '/' + file);
    //
	// 	}
	// });
}
