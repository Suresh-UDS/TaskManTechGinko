// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// model creation

var LocationHistoryModel = function() {
  var LocationHistorySchema = new Schema({
    name: String,
    userId: Number,
    status: String,
    loc: {
      type: [Number],   // format will be [ <longitude> , <latitude> ]
      index: '2dsphere'       // create the geospatial index
    }
  });


  // register the mongoose model
  mongoose.model('LocationHistory', LocationHistorySchema);
};

// create an export function to encapsulate the model creation
module.exports = LocationHistoryModel;