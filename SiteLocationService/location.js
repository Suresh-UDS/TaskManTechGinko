// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// model creation

var LocationModel = function() {
  var LocationSchema = new Schema({
    name: String,
    userId: Number,
    siteId: Number,
    status: String,
    loc: {
      type: [Number],   // format will be [ <longitude> , <latitude> ]
      index: '2dsphere'       // create the geospatial index
    },
    radius: Number,
    lastModifiedDate: Date
  });


  // register the mongoose model
  mongoose.model('Location', LocationSchema);
};

// create an export function to encapsulate the model creation
module.exports = LocationModel;