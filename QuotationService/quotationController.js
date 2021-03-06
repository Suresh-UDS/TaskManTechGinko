var mongoose = require('mongoose');
var moment = require('moment');
var Quotation = mongoose.model('Quotation');
var RateCard = mongoose.model('RateCard');
var RateCardType = mongoose.model('RateCardType');
var mailerService = require('./notifications/mailerService');
var notificationService = require('./notifications/notificationService');
var PDFDocument = require('pdfkit');
var htmlToPdf = require('html-to-pdf');

var fs = require('fs');


    function populateQuotation(req, quotation) {
        var date = new Date();
        if(req.body._id) quotation._id = req.body._id;
        if(req.body.title) quotation.title = req.body.title;
        if(req.body.description) quotation.description = req.body.title;
        if(req.body.rateCardDetails) quotation.rateCardDetails = req.body.rateCardDetails;
        if(req.body.sentByUserId) quotation.sentByUserId = req.body.sentByUserId;
        if(req.body.sentByUserName) quotation.sentByUserName = req.body.sentByUserName;
        if(req.body.sentToUserId) quotation.sentToUserId = req.body.sentToUserId;
        if(req.body.sentToUserName) quotation.sentToUserName = req.body.sentToUserName;
        if(req.body.createdByUserId) quotation.createdByUserId = req.body.createdByUserId;
        if(req.body.createdByUserName) quotation.createdByUserName = req.body.createdByUserName;
        if(req.body.createdByEmail) quotation.createdByEmail = req.body.createdByEmail;
        if(req.body.approvedByUserId) quotation.approvedByUserId = req.body.approvedByUserId;
        if(req.body.approvedByUserName) quotation.approvedByUserName = req.body.approvedByUserName;
        if(req.body.rejectedByUserId) quotation.rejectedByUserId = req.body.rejectedByUserId;
        if(req.body.rejectedByUserName) quotation.rejectedByUserName = req.body.rejectedByUserName;
        if(req.body.authorisedByUserId) quotation.authorisedByUserId = req.body.authorisedByUserId;
        if(req.body.authorisedByUserName) quotation.authorisedByUserName = req.body.authorisedByUserName;
        if(req.body.siteId) quotation.siteId = req.body.siteId;
        if(req.body.siteName) quotation.siteName = req.body.siteName;
        if(req.body.projectId) quotation.projectId = req.body.projectId;
        if(req.body.projectName) quotation.projectName = req.body.projectName;
        if(req.body.ticketId) quotation.ticketId = req.body.ticketId;
        if(req.body.jobId) quotation.jobId = req.body.jobId ;
        if(req.body.clientEmailId) quotation.clientEmailId = req.body.clientEmailId;
        if(req.body.sentToEmailId) quotation.clientEmailId = req.body.clientEmailId;
        if(req.body.grandTotal) quotation.grandTotal = req.body.grandTotal;
        if(req.body.isDrafted){
            quotation.isDrafted = true;
            quotation.processHistory.isDrafted = date;
            quotation.status = 'Pending';
            quotation.createdDate = date;
        }else{
            quotation.isDrafted = false;
        }

        if(req.body.isSubmitted){
            quotation.isSubmitted = true;
            quotation.submittedDate = date;
            quotation.processHistory.isSubmitted = date;
            quotation.status = 'Waiting for approval';
        }else{
            quotation.isSubmitted = false;
        }

        if(req.body.isApproved){
            quotation.isApproved = true;
            quotation.processHistory.isApproved = date;
            quotation.status = 'Approved';
        }else{
            quotation.isApproved = false;
        }

        if(req.body.isRejected){
            quotation.isRejected = true;
            quotation.processHistory.isRejected = date;
            quotation.status = 'Rejected';
        }else{
            quotation.isApproved = false;
        }

        if(req.body.isArchived){
            quotation.isArchived = true;
            quotation.processHistory.isArchived = date;
            quotation.status = 'Archived';
        }else{
            quotation.isArchived = false;
        }
        quotation.lastModifiedDate = date;
        return quotation;

    }



// create an export function to encapsulate the controller's methods
module.exports = {

    ping: function(req, res, next) {
        res.json(200, {
            status: 'Location API is running.',
        });
    },


    createQuotation: function(req, res,next){
        console.log("Create quotation function");
        var quotation = new Quotation();
        console.log(req.body);

        quotation = populateQuotation(req,quotation);

        quotation.save(function(err,quotation){
            if(!err){
                // mailerService.submitQuotation('karthickk@techginko.com',quotation);
                // module.exports.createPDF(quotation);
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
        Quotation.findById(req.body._id,function(err,quotation){
            if(err) {

            }else if(quotation) {
                console.log('found quotation -' + JSON.stringify(quotation))
                quotation = populateQuotation(req,quotation);
                console.log('values updated to quotation -' + JSON.stringify(quotation))
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

        })

    },

    sendQuotation: function(req,res,next){
        console.log("Send quotation");
        console.log(req.body)
        var date = new Date();
        Quotation.findById(req.body._id,function(err,quotation){
                if(err){
                    console.log('Error in sending mail');
                    res.send(200,'Error in sending Mail, Quotation not Sent');
                }else{
                    quotation = populateQuotation(req,quotation);
                    console.log("Mail successfully sent");
                    quotation.isDrafted = false;
                    quotation.isSubmitted = true;
                    quotation.processHistory.isSubmitted = date;
                    quotation.submittedDate = date;
                    quotation.lastModifiedDate = date;
                    mailerService.submitQuotation(quotation.sentToEmailId,quotation)

                    quotation.save(function(err,quotation){
                        if(!err){
                            // mailerService.submitQuotation('karthickk@techginko.com',quotation);
                            notificationService.sendNotification('e678b6d8-9747-4528-864d-911a24cd786a','Quotation Received')
                            res.json(200,quotation)
                        }else{
                            console.log("Error in saving quotation");
                            console.log(err)
                            res.json(500,err);
                        }
                    })
                }
            });
    },

    approveQuotation: function(req,res,next){
        console.log("Approve Quotation - " + req.body._id);
        var date = new Date();
        Quotation.findById(req.body._id,function(err,quotation){
                if(err){
                    console.log('Error in sending mail');
                    res.send(200,'Error in sending Mail, Quotation not Sent');
                }else{
                    console.log("Mail successfully sent");
                    quotation.approvedByUserId = req.body.approvedByUserId;
                    quotation.approvedByUserName = req.body.approvedByUserName;
                    quotation.isSubmitted = false;
                    quotation.isApproved = true;
                    quotation.processHistory.isApproved = date;
                    quotation.approvedDate = date;
                    quotation.lastModifiedDate = date;

                    quotation.save(function(err,quotation){
                        if(!err){
                            // mailerService.submitQuotation('karthickk@techginko.com',quotation);
                            mailerService.qpproveQuotation(quotation.createdByEmail,quotation);
                            notificationService.sendNotification('e678b6d8-9747-4528-864d-911a24cd786a','Quotation Approved by Client')
                            res.json(200,quotation)
                        }else{
                            console.log("Error in saving quotation");
                            console.log(err)
                            res.json(500,err);
                        }
                    })
                }
            });
    },

    rejectQuotation: function(req,res,next){
        console.log("Reject Quotation - " + req.body._id);
        var date = new Date();
        Quotation.findById(req.body._id,function(err,quotation){
                if(err){
                    console.log('Error in sending mail');
                    res.send(200,'Error in sending Mail, Quotation not Sent');
                }else{
                    console.log("Mail successfully sent");
                    quotation.rejectedByUserId = req.body.rejectedByUserId;
                    quotation.rejectedByUserName = req.body.rejectedByUserName;
                    quotation.isSubmitted = false;
                    quotation.isApproved = false;
                    quotation.isRejected = true;
                    quotation.processHistory.isRejected = date;
                    quotation.rejectedDate = date;
                    quotation.lastModifiedDate = date;

                    quotation.save(function(err,quotation){
                        if(!err){
                            // mailerService.submitQuotation('karthickk@techginko.com',quotation);
                            mailerService.rejectQuotation(quotation.createdByEmail,quotation);
                            notificationService.sendNotification('e678b6d8-9747-4528-864d-911a24cd786a','Quotation Rejected by Client')
                            res.json(200,quotation)
                        }else{
                            console.log("Error in saving quotation");
                            console.log(err)
                            res.json(500,err);
                        }
                    })
                }
            });
    },

    archiveQuotation: function(req,res,next){

        console.log("Archive Quotation");
        var date = new Date();
        Quotation.findById(req.body.id,function(err,quotation){
            quotation.isApproved = false;
            quotation.isArchived = true;
            quotation.processHistory.isArchived = date;
            quotation.lastModifiedDate = date;
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
        console.log("Create rate card - " + req.body.name + ' , ' + req.body.title);
        var rateCard = new RateCard();
        if(req.body.title) rateCard.title = req.body.title;
        if(req.body.name) rateCard.name = req.body.name;
        if(req.body.projectId) rateCard.projectId = req.body.projectId;
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

    deleteRateCard: function(req,res,next){
      console.log("Delete Rate card");
      console.log(req.id);
      RateCard.remove(id,function(err){
          if(err){
              console.log("Error in finding rateCard");
              res.send(500,err);
          }else{
              console.log("Rate card removed");
              res.send(200);
          }
      })
    },

    getQuotations: function(req,res,next){
      console.log("Get Quotations" + JSON.stringify(req.body));
      Quotation.find({siteId:req.body.siteId}, function(err,quotations){
          if(err){
              console.log("unable to get Quotations")
              res.send(200,err);
          }else{
              console.log('Get Quotations response - ' + quotations);
              res.send(200,quotations);
          }
      })
    },

    getQuotation: function(req,res,next){
        console.log("Get quotations by id");
        console.log(req.params.id);
        if(req.params.id) {
            Quotation.findById(req.params.id, function(err,quotation){
                console.log('quotation details - '+ quotation);
                if(err){
                    res.send(500, err);
                } else{
                    res.send(200,quotation);
                }

            })
        }
    },


    getQuotationById: function(req,res,next){
        console.log("Get quotations by id");
        console.log(req.params.id);
        var query = Quotation.find({sentByUserId:req.params.id})
        query.sort('-lastModifiedDate')
        query.exec(function(err,quotations){
            if(err){
                res.send(500, err);
            } else{
                res.send(200,quotations);
            }

        })
    },

    search: function(req,res,next){
      console.log("Search quotations");
      console.log(req.body);
      Quotation.find({title:{$regex:'^'+req.body.title,$options:"si"}}).sort({'title':1}).limit(10).exec(function(err,result){
          if(err){
              console.log("Error in finding quotation");
              res.send(200,'No Quotation found');
          }else{
              var response = _.map(result,function(data){
                  return data.model
              })
          }
          res.send(200,response);
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

    createPDF: function(quotation){

       mailerService.getPdfDetail(quotation,function(err,response){
           if(err){
               console.log("Error in getting html template");
               console.log(err);
           }else{
               console.log("Html template success");
               console.log(response);
               console.log(JSON.stringify(response))

               htmlToPdf.convertHTMLString(response, './templates/output.pdf',
                   function (error, success) {
                       if (error)
                       {
                           console.log('PDF Fail');
                           console.log(error);
                       } else
                       {
                           console.log('PDF Success!');
                           console.log(success);
                           mailerService.submitQuotationDetail('praveens@techginko.com');
                       }
                   }
               );

           }
       })


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
