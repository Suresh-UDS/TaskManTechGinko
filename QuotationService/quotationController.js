var mongoose = require('mongoose');
var moment = require('moment');
var Quotation = mongoose.model('Quotation');
var RateCard = mongoose.model('RateCard');
var RateCardType = mongoose.model('RateCardType');
var mailerService = require('./mailerService');



// create an export function to encapsulate the controller's methods
module.exports = {

    ping: function(req, res, next) {
        res.json(200, {
            status: 'Location API is running.',
        });
    },

    createQuotation: function(req, res,next){
        console.log("Create quotation function");
        var date = new Date();
        var quotation = new Quotation();
        if(req.body.title) quotation.title = req.body.title;
        if(req.body.description) quotation.description = req.body.title;
        if(req.body.rateCardDetails) quotation.rateCardDetails = req.body.rateCardDetails;
        if(req.body.sentByUserId) quotation.sentByUserId = req.body.sentByUserId;
        if(req.body.sentByUserName) quotation.sentByUserName = req.body.sentByUserName;
        if(req.body.sentToUserId) quotation.sentToUserId = req.body.sentToUserId;
        if(req.body.sentToUserName) quotation.sentToUserName = req.body.sentToUserName;
        if(req.body.createdByUserId) quotation.createdByUserId = req.body.createdByUserId;
        if(req.body.createdByUserName) quotation.createdByUserName = req.body.createdByUserName;
        if(req.body.approvedByUserId) quotation.approvedByUserId = req.body.approvedByUserId;
        if(req.body.approvedByUserName) quotation.approvedByUserName = req.body.approvedByUserName;
        if(req.body.authorisedByUserId) quotation.authorisedByUserId = req.body.authorisedByUserId;
        if(req.body.authorisedByUserName) quotation.authorisedByUserName = req.body.authorisedByUserName;
        quotation.isDrafted = true;
        quotation.isSubmitted = false;
        quotation.isApproved = false;
        quotation.isArchived = false;
        quotation.lastModifiedDate = date;

        quotation.save(function(err,quotation){
            if(!err){
                mailerService.submitQuotation();
                res.json(200,quotation)
            }else{
                console.log("Error in saving quotation");
                res.json(500,err);
            }
        })
    },

    createRateCard: function(req,res,next){
        console.log("Create rate card");
        var rateCard = new RateCard();
        if(req.body.title) rateCard.title = req.body.title;
        if(req.body.type) rateCard.type = req.body.type;
        if(req.body.cost) rateCard.cost = req.body.cost;
        if(req.body.uom) rateCard.uom = req.body.uom;
        rateCard.lastModifiedDate = new Date();

        rateCard.save(function(err){
            if(!err){
                res.json(200,rateCard);
            }else{
                res.json(500,err);
            }
        })
    },

    getQuotations: function(req,res,next){
      console.log("Get Quotations");
      Quotation.find({}, function(err,quotations){
          if(err){
              console.log("unable to get Quotations")
              res.send(200,err);
          }else{
              res.send(200,quotations);
          }
      })
    },

    getRateCards: function(req,res,next){
        console.log("Get Quotations");
        RateCard.find({}, function(err,rateCards){
            if(err){
                console.log("unable to get Quotations")
                res.send(200,err);
            }else{
                res.send(200,rateCards);
            }
        })
    },

    getRateCardTypes: function(req,res,next){
        console.log("Get Rate Card types");
        RateCardType.find({}, function(err, rateCardTypes){
            if(err){
                console.log("Error in getting Rate card types");
                res.send(200,err)
            }else{
                res.send(200,rateCardTypes);
            }
        })
    },

    saveSiteLocation: function(req, res, next) {
        console.log('saveSiteLocation called -' + req.body)
        var locations = [req.body.lng, req.body.lat];
        var location = new Location();
        location.userId = req.body.userId;
        location.status = req.body.status;
        location.lastModifiedDate = moment().toDate();
        location.loc = locations;
        location.siteId = req.body.siteId;
        location.radius = req.body.radius;
        console.log(location);
        Location.findOne({siteId : location.siteId},function(err,result){
            console.log('saveSiteLocation - err '+ err)
            console.log('saveSiteLocation - result '+ result);
            if(err) {
                res.json(500, "Error updating provider location - " + err);
            }
            if(result) {
                result.status = location.status;
                result.lastModifiedDate = location.lastModifiedDate;
                result.loc = locations;
                result.siteId = location.siteId;
                result.radius = location.radius;
                result.save(function(err){
                    if(!err) {
                        res.json(200,location);
                    }
                })
            }else {
                location.save(function(err) {
                    if(!err) {
                        res.json(200,location);
                    }
                })
            }
        });
    },

    findSiteLocation: function(req, res, next) {
        var userId = req.query.userId;
        Location.findOne({userId : userId},function(err,result){
            if(err) {
                res.json(500, "Error retrieving provider location - " + err);
            }
            if(result) {
                res.json(200,result);
            }
        });
    },


    isSiteNearby: function(req, res, next) {
        console.log('isSiteNearby called')
        var limit = parseInt(req.query.limit) || 10;
        var siteId = parseInt(req.query.siteId)

        // get the max distance or set it to 8 kilometers
        //var maxDistance = parseInt(req.query.distance) || 8;

        // find a location
        Location.findOne({
            siteId: siteId
        }).exec(function(err, siteLocation) {
            if(err) {
                return res.json(500, err);
            }
            var maxDistance = siteLocation.radius;

            // we need to convert the distance to radians
            // the raduis of Earth is approximately 6371 kilometers
            maxDistance /= 6371;

            // get coordinates [ <longitude> , <latitude> ]
            var coords = [];
            coords[0] = req.query.lng || 0;
            coords[1] = req.query.lat|| 0;

            var status = req.query.status;

            // find a location
            Location.find({
                loc: {
                    $nearSphere: coords,
                    $maxDistance: maxDistance
                }
            }).limit(1).exec(function(err, locations) {
                console.log('err-' + err);
                if (err) {
                    return res.json(500, err);
                }
                console.log(locations);
                if(locations[0]){
                    var nearbySite = locations[0];
                    if(nearbySite.siteId == siteId) {
                        res.json(200, '{status: true}')
                    }
                }
                res.json(500, '{status: false}');
            });
        });
    }
};
