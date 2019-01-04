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
var sequence = require('./schema/sequence');
//var controllers = require('./controller');
var quotationController = require('./quotationController');
var notificationService = require('./notifications/notificationService');
var Location = mongoose.model('Quotation');
var RateCard = mongoose.model('RateCard');
var RateCardType = mongoose.model('RateCardType');
var Notification = mongoose.model('Notification');
var Sequence = mongoose.model('Sequence');
var fs = require('fs');
var path = require('path');
var config = require('./'+ process.argv[2] + '.properties');
var database = require('./config/db');

var cors = require('cors');


function startup(){

  // Bootstrap mongoose and load dummy data
  // mongoose.connect('mongodb://nodedbuser:T#nC0s@10.1.2.132:27017,10.1.2.187:27017/quotation_svc?replicaSet=rs0', function(err) {
  //   if (err) throw err;

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

  // });

    // Init Database
    console.log('Environment -' + process.argv[2]);
    console.log('DB config  -' + config.db);
    database.init(config.db);

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
  //app.get('/', controllers.ping);
  //app.get('/api/site/nearby', controllers.isSiteNearby);
  //app.post('/api/site/location', controllers.saveSiteLocation);
  //app.get('/api/site/location', controllers.findSiteLocation);


  app.post('/api/quotation/create', quotationController.createQuotation);
  app.post('/api/quotation/edit', quotationController.editQuotation);
  app.post('/api/quotation/send', quotationController.sendQuotation);
  app.post('/api/quotation/approve',quotationController.approveQuotation);
  app.post('/api/quotation/reject',quotationController.rejectQuotation);
  app.post('/api/rateCard/create', quotationController.createRateCard);

  app.get('/api/quotation/id/:id',quotationController.getQuotation);
  app.get('/api/quotation/:id',quotationController.getQuotationById);
  app.post('/api/quotation',quotationController.newSearchQuotation);
  app.post('/api/quotation/search', quotationController.getQuotations);
  app.get('/api/rateCard', quotationController.getRateCards);
  app.post('/api/rateCard', quotationController.getRateCards);
  app.get('/api/pdf/create',quotationController.createPDF);
  app.get('/api/rateCardTypes',quotationController.getRateCardTypes);
  app.post('/api/rateCard/delete',quotationController.deleteRateCard);
  app.post('/api/quotation/uploadImage',quotationController.updateImages);
  app.post('/api/quotation/summary', quotationController.getSummary);
  app.get('/api/quotations/findAll', quotationController.findAllQuotations);
  app.get('/api/lastmodified/quotations', quotationController.findLastModified);

  // app.post('/api/oneSignal/send',notificationService.sendNotification);
  // app.post('/api/oneSignal/subscribe', notificationService.subscribe);

  // app.get('/api/rateCard/search',quotationController.getRateCardsPageWise);

    setupMasterData();
  listen(server);
}

function setupMasterData(){
    var Sequence = require('mongoose').model('Sequence');

    Sequence.findOne({type : 'quotation'}, function(err, result) {
        if(!result) {
            Sequence.create({
                "type" : "quotation",
                "value" : 1
            });
        }
    })

    RateCardType.findOne({name:'MATERIAL'},function (err, result) {
        if(!result){
            RateCardType.create({
                "name":"MATERIAL",
                "uom":"PER_QTY"
            })
        }
    })

    RateCardType.findOne({name:'LABOUR'},function (err, res) {
        if(!res){
            RateCardType.create({
                "name":"LABOUR",
                "uom":"PER_HOUR"
            })
        }
    })

    RateCardType.findOne({name:'SERVICE'},function (err, res) {
        if(!res){
            RateCardType.create({
                "name":"SERVICE",
                "uom":"FIXED"
            })
        }
    })
}

function listen(server){
    var port = 8001;
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
