// Define variables & dependencies

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var mongoose = require('mongoose');
var async = require('async');
var location = require('./location')();
var controllers = require('./controller');
var Location = mongoose.model('Location');
var fs = require('fs');
var path = require('path');




function startup(){

  // Bootstrap mongoose and load dummy data
    //mongoose.connect('mongodb://admin:Tgadmin123#@localhost:27017/quotation_svc', function(err) {
    mongoose.connect('mongodb://10.1.2.132:27017,10.1.2.187:27017/location_svc?replicaSet=rs0', function(err) {
    if (err) throw err;

    /*
    // load data from file and transform it to Object
    var data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

    // clean db and load new data
    Location.remove(function() {
      async.each(data, function(item, callback) {
        // create a new location
        Location.create(item, callback);
      }, function(err) {
        if (err) throw err;
      });
    });

    */

  });

  // Configure Express

  app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
  });

  // Define routes
  app.get('/', controllers.ping);
  app.get('/api/site/nearby', controllers.isSiteNearby);
  app.post('/api/site/location', controllers.saveSiteLocation);
  app.get('/api/site/location', controllers.findSiteLocation);

  listen(server);
}

function listen(server){
    var port = 8000;
    server.listen(port, function(err,result) {
      if (err)
          console.error(err)
      else
          console.log('Express server up and running - provider location service at port -' + port)
	})
}



module.exports = {

	startup:startup
}