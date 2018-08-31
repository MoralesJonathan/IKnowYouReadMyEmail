const express = require('express')
  server = express()
  port = process.env.PORT || 8080
  environment = server.get('env')
  path = require("path")
  logger = require('morgan')
  mongoClient = require('mongodb').MongoClient
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
  .use(logger('common'));

server
  .get('/image/:emailAccount/:recipient/:subject/:id', (req, res) => {
    let emailAccount = req.params.emailAccount
    recipient = req.params.recipient
    subject = req.params.subject
    id = req.params.id;
    mongoClient.connect(process.env.MONGODB_URI, function (error, database) {
      if (!error) {
        console.log("Connected successfully to MongoDB server");
        let collection = database.db().collection(emailAccount);
        collection.findOne({
          id: id
        }, function (error, tracker) {
          if (tracker !== null) {
            mailOptions.text = `Email with ID ${tracker.id} sent from account ${emailAccount} was read by: ${tracker.emailRecipient} for email subject: ${tracker.emailSubject}`;
            mailOptions.html = `<p>${mailOptions.text}</p>`;
            transporter.sendMail(mailOptions, (error, info) => {
              error ? console.log(error) : console.log('Message sent: %s', info.messageId);
            });
            collection.updateOne({
              id: id
            },{ $set: {
              dateRead: new Date().toISOString(),
            }},(err,res) => {
                if(err) console.log(`Error updating date opened to db: ${err}`)
                database.close();
            })
            res.sendFile('track.jpg', { root: path.join(__dirname, '/public') });
          } else {
            collection.insertOne({
              id: id,
              emailRecipient: recipient,
              emailSubject: subject,
              dateAttached: new Date().toISOString(),
              dateRead: ''
            }, (errr, newTracker) => {
              database.close();
              errr ? (console.log(errr), res.sendFile('noTracker.png', { root: path.join(__dirname, '/public') })) : res.sendFile('track.jpg', { root: path.join(__dirname, '/public') });
            });
          }
        });
      }
    });
  });

server.listen(port, () => {
  console.log(`Server is running on port ${port} and is running with a ${environment} environment.`);
  transporter.verify((error, success) => {
    error? console.log(error): console.log('SMTP connection established. Ready to send emails.');
 });
})
