var mailer = require('../config/mailer');
var config = require('../config/'+ process.argv[2] + '.properties');
var uuid = require('node-uuid');
var handlebars = require('handlebars');
var path = require('path');
var fs = require('fs');
var emailTemplates = {};
var handlebarsStatic = require('handlebars-static');
registerTemplates();


function registerTemplates(){
    var templateDir = path.join('/home/ec2-user/QuotationService/', 'templates/');
    // var templateDir = path.join('D:/usha/ionic/FMS-NEW/QuotationService/templates/');

    fs.readdirSync(templateDir).forEach(function (file) {
        fs.readFile(templateDir+file, function(err, buf) {
            var templateName = file.replace(/.html/g, "")
            handlebars.registerHelper('static', handlebarsStatic(''));

            emailTemplates[templateName] =  handlebars.compile( buf.toString());
        });
    });
    /*setTimeout(function(){
     sendMail( config.mailer.from,
     'balasubhramanian@gmail.com',
     'Verify you email',
     'signup',{code:55678,firstname:'Bala',lastname:'Muthuvelu'})
     },2000);*/
}


function getContent(template,data){
    data.appName = 'UDS - TaskMan'
    return emailTemplates.header(data) + emailTemplates[template](data) + emailTemplates.footer(data)
}

function sendMail(from,to,subject,template,data){
    // logger.info("sending mail - template - "+template);
    data.logo = 'http://uds.in/images/logo.jpg';
    mailer.sendMail({
        from: from,
        to: to,
        subject: subject,
        html: getContent(template,data)
    });
}

function sendMailWithAttachments(from,to,subject,template,data,attachments){
    data.logo = 'http://uds.in/images/logo.jpg';
    mailer.sendMail({
        from: from,
        to: to,
        subject: subject,
        html: getContent(template,data),
        attachments:attachments
    });
}




var defaultFrom = config.mailer.from;
module.exports = {
    submitQuotation: function(emailId, data) {
console.log("sending email ids:- ",emailId);         console.log("Data:- ",data._id);
        sendMailWithAttachments( config.mailer.from,
            emailId,
            'Quotation Submitted',
            'submit_quotation_template',
            {clientName: data.projectName,
                siteName: data.siteName,
                createdByUserName:data.createdByUserName, url:config.url.quotation_view + data._id},
            {
                filename: 'quotation.pdf',
                path: './templates/'+data._id+'.pdf',
                contentType: 'application/pdf'
            })
    },
    approveQuotation: function(emailId, data) {
        sendMail( config.mailer.from,
            emailId,
            'Quotation Approved',
            'approved_quotation_template',
            {clientName: data.sentToUserName,
                siteName: data.siteName,
                createdByUserName:data.createdByUserName,url:config.url.quotation_view + data._id})
    },

    rejectQuotation: function(emailId, data) {
        sendMail( config.mailer.from,
            emailId,
            'Quotation Rejected',
            'rejected_quotation_template',
            {clientName: data.sentToUserName,
                siteName: data.siteName,
                createdByUserName:data.createdByUserName,url:config.url.quotation_view + data._id})
    },

    getPdfDetail:function (data,callback) {
        console.log("Get pdf details");
        console.log(data);
        var template='quotation';
        var testData =emailTemplates[template](data);
        console.log("pdf tempalte data");
        console.log(data);
        console.log(testData);
        callback(null,testData)
    },

    submitQuotationDetail:function (mail) {
        mailer.sendMail({
            from: config.mailer.from,
            to: mail,
            subject:'Quotation',
            attachments: [{
                filename: 'output.pdf',
                path: './templates/output.pdf',
                contentType: 'application/pdf'
            }]
        }, (err, info) => {});
    }

};
