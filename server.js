const express = require('express')
  server = express()
  port = process.env.PORT || 8080
  environment = server.get('env')
  path = require("path")
  logger = require('morgan')
  fs = require('fs')
  keys = require('./keys.json');

server
  .use(express.static('public'))
  .use(logger('dev'));

server
  .get('/image/:emailAccount/:recipient/:subject', (req, res) => {
    console.log(`Email sent from account: ${req.params.emailAccount} was read by: ${req.params.recipient} for email subject: ${req.params.subject}`)
    res.sendFile('track.jpg', { root: path.join(__dirname, '/public') });
  })

server.listen(port, () => {
  console.log(`Server is running on port ${port} and is running with a ${environment} environment.`);
})