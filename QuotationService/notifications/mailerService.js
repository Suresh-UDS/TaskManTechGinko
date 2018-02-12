var mailer = require('../config/mailer');
var config = require('../config/'+ process.argv[2] + '.properties');
var uuid = require('node-uuid');
var handlebars = require('handlebars');
var path = require('path');
var fs = require('fs');
var emailTemplates = {};
registerTemplates();

function registerTemplates(){
    var templateDir = path.join(__dirname+'../../../', 'templates/email/');
    var templateDir = path.join('D:/workspace/FMS/QuotationService/templates/');

    fs.readdirSync(templateDir).forEach(function (file) {
        fs.readFile(templateDir+file, function(err, buf) {
            var templateName = file.replace(/.html/g, "")
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
    data.logo = './config/logo.png';
        mailer.sendMail({
            from: from,
            to: to,
            subject: subject,
            html: getContent(template,data)
        });
}

var defaultFrom = config.mailer.from;
module.exports = {
    submitQuotation: function(emailId, data) {
            sendMail( config.mailer.from,
                emailId,
                'Quotation for '+data.siteName,
                'submit_quotation_template',
                {clientName: data.sentToUserName,
                    siteName: data.siteName,
                    createdByUserName:data.createdByUserName})
        }

}