const { debug } = require('../dist/index')
const express = require('express')

const server = express()

server.get('/', (req, res) => {
  res.send('test1')
})

debug(server.listen(3321, '0.0.0.0'))

