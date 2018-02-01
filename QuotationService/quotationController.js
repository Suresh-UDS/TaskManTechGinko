var mongoose = require('mongoose');
var moment = require('moment');
var Quotation = mongoose.model('Quotation');
var RateCard = mongoose.model('RateCard');
var RateCardType = mongoose.model('RateCardType');
var mailerService = require('./notifications/mailerService');
var PDFDocument = require('pdfkit');
var fs = require('fs');


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
        console.log(req.body);
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
        if(req.body.siteName) quotation.siteName = req.body.siteName;
        if(req.body.clientEmailId) quotation.clientEmailId = req.body.clientEmailId;
        if(req.body.grandTotal) quotation.grandTotal = req.body.grandTotal;
        if(req.body.isDrafted){
            quotation.isDrafted = true;
            quotation.processHistory.isDrafted = date;
        }else{
            quotation.isDrafted = false;
        }

        if(req.body.isSubmitted){
            quotation.isSubmitted = true;
            quotation.processHistory.isSubmitted = date;
        }else{
            quotation.isSubmitted = false;
        }

        if(req.body.isApproved){
            quotation.isApproved = true;
            quotation.processHistory.isApproved = date;
        }else{
            quotation.isApproved = false;
        }

        if(req.body.isArchived){
            quotation.isArchived = true;
            quotation.processHistory.isArchived = date;
        }else{
            quotation.isArchived = false;
        }
        quotation.lastModifiedDate = date;

        quotation.save(function(err,quotation){
            if(!err){
                // mailerService.submitQuotation('karthickk@techginko.com',quotation);
                res.json(200,quotation)
            }else{
                console.log("Error in saving quotation");
                console.log(err)
                res.json(500,err);
            }
        })
    },

    editQuotation: function(req,res,next){
        console.log("Edit Quotation");
        console.log(req.body)
        var date = new Date();
        Quotation.findById(req.body.id,function(err,quotation){

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
            if(req.body.siteName) quotation.siteName = req.body.siteName;
            if(req.body.clientEmailId) quotation.clientEmailId = req.body.clientEmailId;
            if(req.body.grandTotal) quotation.grandTotal = req.body.grandTotal;
            if(req.body.isDrafted){
                quotation.isDrafted = true;
                quotation.processHistory.isDrafted = date;
            }else{
                quotation.isDrafted = false;
            }

            if(req.body.isSubmitted){
                quotation.isSubmitted = true;
                quotation.processHistory.isSubmitted = date;
            }else{
                quotation.isSubmitted = false;
            }

            if(req.body.isApproved){
                quotation.isApproved = true;
                quotation.processHistory.isApproved = date;
            }else{
                quotation.isApproved = false;
            }

            if(req.body.isArchived){
                quotation.isArchived = true;
                quotation.processHistory.isArchived = date;
            }else{
                quotation.isArchived = false;
            }
            quotation.lastModifiedDate = date;

            quotation.save(function(err,quotation){
                if(!err){
                    // mailerService.submitQuotation('karthickk@techginko.com',quotation);
                    res.json(200,quotation)
                }else{
                    console.log("Error in saving quotation");
                    console.log(err)
                    res.json(500,err);
                }
            })

        })

    },

    sendQuotation: function(req,res,next){
        console.log("Send quotation");
        Quotation.findById(req.body.id,function(err,quotation){
            mailerService.submitQuotation(quotation.sentToEmailId,quotation).then(function(err,success){
                if(err){
                    console.log('Error in sending mail');
                    res.send(200,'Error in sending Mail, Quotation not Sent');
                }else{
                    console.log("Mail successfully sent");
                    quotation.isDrafted = false;
                    quotation.isSubmitted = true;
                    quotation.processHistory.isSubmitted = new Date();

                    quotation.save(function(err,quotation){
                        if(!err){
                            // mailerService.submitQuotation('karthickk@techginko.com',quotation);
                            res.json(200,quotation)
                        }else{
                            console.log("Error in saving quotation");
                            console.log(err)
                            res.json(500,err);
                        }
                    })
                }
            });
        })
    },

    approveQuotation: function(req,res,next){
        console.log("Approve Quotation");
        Quotation.findById(req.body.id,function(err,quotation){
            mailerService.submitQuotation(quotation.clientEmailId,quotation).then(function(err,success){
                if(err){
                    console.log('Error in sending mail');
                    res.send(200,'Error in sending Mail, Quotation not Sent');
                }else{
                    console.log("Mail successfully sent");
                    quotation.isSubmitted = false;
                    quotation.isApproved = true;
                    quotation.processHistory.isApproved = new Date();

                    quotation.save(function(err,quotation){
                        if(!err){
                            // mailerService.submitQuotation('karthickk@techginko.com',quotation);
                            res.json(200,quotation)
                        }else{
                            console.log("Error in saving quotation");
                            console.log(err)
                            res.json(500,err);
                        }
                    })
                }
            });
        })
    },

    archiveQuotation: function(req,res,next){

        console.log("Archive Quotation");
        Quotation.findById(req.body.id,function(err,quotation){
            quotation.isApproved = false;
            quotation.isArchived = true;
            quotation.processHistory.isArchived = new Date();
            quotation.save(function(err,quotation){
                if(!err){
                    // mailerService.submitQuotation('karthickk@techginko.com',quotation);
                    res.json(200,quotation)
                }else{
                    console.log("Error in saving quotation");
                    console.log(err);
                    res.json(500,err);
                }
            })
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
                console.log(err)
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

    createPDF: function(req,res,next){
        var doc=new PDFDocument;
        doc.pipe= fs.createWriteStream('./templates/output.pdf');
        doc.font('fonts/PalatinoBold.ttf')
            .fontSize(25)
            .text(req.body,100,100)

        doc.end();
        res.send(200);
    },

    getQuotationsPagewise: function(req,res,next){
        RateCard.find().skip(req.body.noi*(req.body.pageNumber-1)).limit(req.body.noi).exec(function(err,rateCards){
            console.log("rate cards");
            if(err){
                res.send(200,err);
            }else{
                res.send(200,rateCards);
            }
        })
    },

    
};
