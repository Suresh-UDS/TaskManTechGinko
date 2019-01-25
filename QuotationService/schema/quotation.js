// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var	captainHook  = require('captain-hook');

// model creation

var QuotationModel = function() {
    var QuotationSchema = new Schema({
        serialId: Number,
        title: String,
        description : String,
        rateCardDetails:[],
        processHistory:[],
        grandTotal:String,
        isDrafted:Boolean,
        isSubmitted:Boolean,
        isApproved:Boolean,
        isRejected:Boolean,
        isArchived:Boolean,
        siteId:Number,
        clientId:Number,
        clientName:String,
        siteName:String,
        projectId:String,
        projectName:String,
        ticketId:Number,
        jobId:Number,
        clientEmailId:String,
        sentToEmailId:String,
        createdByUserId:String,
        createdByUserName:String,
        createdByEmail:String,
        sentByUserId:String,
        sentByUserName:String,
        approvedByUserId:String,
        approvedByUserName:String,
        rejectedByUserId:String,
        rejectedByUserName:String,
        authorisedByUserId:String,
        authorisedByUserName:String,
        sentToUserId:String,
        sentToUserName:String,
        lastModifiedDate: Date,
        createdDate: Date,
        submittedDate: Date,
        approvedDate: Date,
        rejectedDate: Date,
        archivedDate: Date,
        status:String,
        images:[]
    });

    QuotationSchema.plugin(captainHook);

    QuotationSchema.preCreate(function(quotation, next){
      var sequenceGenerator = require('mongoose').model('Sequence');
      sequenceGenerator.getNext('quotation',function(id){
        quotation.serialId = id;
        next();
      })

    })

    QuotationSchema.preUpdate(function(quotation, next){
      next();
    })

    // register the mongoose model
    mongoose.model('Quotation', QuotationSchema);
};



// create an export function to encapsulate the model creation
module.exports = QuotationModel;