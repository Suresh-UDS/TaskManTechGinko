// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// model creation

var RateCardModel = function() {
    var RateCardSchema = new Schema({
        projectId: Number,
        title: String,
        name: String,
        type: String,
        cost: Number,
        uom: String,
        lastModifiedDate: Date
    });


    // register the mongoose model
    mongoose.model('RateCard', RateCardSchema);
};

// create an export function to encapsulate the model creation
module.exports = RateCardModel;