var mongoose = require('mongoose');
var moment = require('moment');
var Location = mongoose.model('Location');

// create an export function to encapsulate the controller's methods
module.exports = {

  ping: function(req, res, next) {
    res.json(200, {
      status: 'Location API is running.',
    });
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
        if(locations && locations.length>0){
          locations.forEach(function (location) {
              if(location.siteId == siteId){
                  res.json(200,'{status : true}')
              }
          })
        }
        res.json(500, '{status: false}');
      });
     });
  }
};
