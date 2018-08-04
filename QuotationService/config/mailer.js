var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

var config = require('./'+ process.argv[2] + '.properties')


var transporter = nodemailer.createTransport(smtpTransport({
    service: config.mailer.service,
    host: config.mailer.smtp.host,
    secure: config.mailer.smtp.secureConnection,
    port: config.mailer.smtp.port,
    auth: {
        user: config.mailer.username,
        pass: config.mailer.password
    },
    logger: true,
    debug: true
}));


console.log('Initalizing mailer');


module.exports = transporter;