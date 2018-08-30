const express = require('express')
  server = express()
  port = process.env.PORT || 8080
  environment = server.get('env')
  path = require("path")
  logger = require('morgan')
  fs = require('fs')
  nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
      user: process.env.EMAILUSER, 
      pass: process.env.EMAILPASSWORD
  }
});

let mailOptions = {
  from: '"Email Reader" <reader@no-reply.com>', 
  to: 'jonathan@everymundo.com',
  subject: 'Email Read ✔', 
  text: '',
  html: ''
};

server
  .use(express.static('public'))
  .use(logger('dev'));

server
  .get('/image/:emailAccount/:recipient/:subject', (req, res) => {
    mailOptions.text = `Email sent from account: ${req.params.emailAccount} was read by: ${req.params.recipient} for email subject: ${req.params.subject}`,
    mailOptions.html = `<p>${mailOptions.text}</p>`
    transporter.sendMail(mailOptions, (error, info) => {
      error? console.log(error): console.log('Message sent: %s', info.messageId);
    });
    res.sendFile('track.jpg', { root: path.join(__dirname, '/public') });
  })

server.listen(port, () => {
  console.log(`Server is running on port ${port} and is running with a ${environment} environment.`);
  transporter.verify((error, success) => {
    error? console.log(error): console.log('SMTP connection established. Ready to send emails.');
 });
})