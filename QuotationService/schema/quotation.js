// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// model creation

var QuotationModel = function() {
    var QuotationSchema = new Schema({
        title: String,
        description : String,
        rateCardDetails:[],
        processHistory:[],
        grandTotal:String,
        isDrafted:Boolean,
        isSubmitted:Boolean,
        isApproved:Boolean,
        isArchived:Boolean,
        siteId:String,
        siteName:String,
        projectId:String,
        projectName:String,
        clientEmailId:String,
        sentToEmailId:String,
        createdByUserId:String,
        createdByUserName:String,
        sentByUserId:String,
        sentByUserName:String,
        approvedByUserId:String,
        approvedByUserName:String,
        authorisedByUserId:String,
        authorisedByUserName:String,
        sentToUserId:String,
        sentToUserName:String,
        lastModifiedDate: Date,
        createdDate: Date,
        submittedDate: Date,
        approvedDate: Date,
        archivedDate: Date
    });


    // register the mongoose model
    mongoose.model('Quotation', QuotationSchema);
};

// create an export function to encapsulate the model creation
module.exports = QuotationModel;