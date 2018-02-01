// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// model creation

var RateCardTypeModel = function() {
    var RateCardTypeModelSchema = new Schema({
        name: String,
        uom: String,
        lastModifiedDate: Date
    });


    // register the mongoose model
    mongoose.model('RateCardType', RateCardTypeModelSchema);
};

// create an export function to encapsulate the model creation
module.exports = RateCardTypeModel;