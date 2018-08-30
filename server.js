const express = require('express')
  server = express()
  port = 8080
  environment = server.get('env')
  logger = require('morgan')
  fs = require('fs')
  keys = require('./keys.json');

server
  .use(express.static('public'))
  .use(logger('dev'));

server
  .get('/', (req, res) => {
    res.send('Nice!');
  })
  .post('/', (req, res) => {
    res.send('Nice!');
  })

server.listen(port, () => {
  console.log(`Server is running on port ${port} and is running with a ${environment} environment.`);
})