// Define variables & dependencies

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var mongoose = require('mongoose');
var async = require('async');
var quotation = require('./schema/quotation')();
var rateCard = require('./schema/rateCard')();
var rateCardType = require('./schema/rateCardType')();
var notification = require('./schema/notification')();
var controllers = require('./controller');
var quotationController = require('./quotationController');
var notificationService = require('./notifications/notificationService');
var Location = mongoose.model('Quotation');
var RateCard = mongoose.model('RateCard');
var RateCardType = mongoose.model('RateCardType');
var Notification = mongoose.model('Notification');
var fs = require('fs');
var path = require('path');

var cors = require('cors');


function startup(){

  // Bootstrap mongoose and load dummy data
  mongoose.connect('mongodb://localhost:27017/quotation_svc', function(err) {
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

  app.use(function(req, res, next){
      res.header("Access-Control-Allow-Origin", "*");
      req.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
  });


  // Define routes
  app.get('/', controllers.ping);
  app.get('/api/site/nearby', controllers.isSiteNearby);
  app.post('/api/site/location', controllers.saveSiteLocation);
  app.get('/api/site/location', controllers.findSiteLocation);


  app.post('/api/quotation/create', quotationController.createQuotation);
  app.post('/api/quotation/edit', quotationController.editQuotation);
  app.post('/api/quotation/send', quotationController.sendQuotation);
  app.post('/api/quotation/approve',quotationController.approveQuotation);
  app.post('/api/rateCard/create', quotationController.createRateCard);

  app.get('/api/quotation/:id',quotationController.getQuotationById);
  app.get('/api/quotation/search',quotationController.search);
  app.get('/api/quotation', quotationController.getQuotations);
  app.post('/api/quotation', quotationController.getQuotations);
  app.get('/api/rateCard', quotationController.getRateCards);
  app.post('/api/rateCard', quotationController.getRateCards);
  app.get('/api/pdf/create',quotationController.createPDF);
  app.get('/api/rateCardTypes',quotationController.getRateCardTypes);
  app.post('/api/rateCard/delete',quotationController.deleteRateCard);

  // app.post('/api/oneSignal/send',notificationService.sendNotification);
  // app.post('/api/oneSignal/subscribe', notificationService.subscribe);

  // app.get('/api/rateCard/search',quotationController.getRateCardsPageWise);
  listen(server);
}

function listen(server){
    var port = 8000;
    server.listen(port, function(err,result) {
      if (err)
          console.error(err);
      else
          console.log('Express server up and running - provider location service at port -' + port)
	})
}


module.exports = {

	startup:startup
}