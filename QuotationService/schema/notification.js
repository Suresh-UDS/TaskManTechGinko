// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// model creation

var NotificationModel = function() {
  var NotificationSchema = new Schema({
  	userId:String,
  	oneSignalId:String,
  	isPushSubsribed:Boolean,
    lastModifiedDate: Date
  });


  // register the mongoose model
  mongoose.model('Notification', NotificationSchema);
};

// create an export function to encapsulate the model creation
module.exports = NotificationModel;