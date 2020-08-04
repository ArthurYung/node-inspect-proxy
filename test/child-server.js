const { debug } = require('../dist/index')
const { createServer } = require('http')

const server = createServer((req, res) => {
  // TODO: Enable this test when Jest release 25.0.0
  // https://github.com/facebook/jest/issues/7247

  // expect(process.domain).not.toBeNull();
  res.statusCode = 200;
  res.end("success");
}).listen(3320);

debug(server)

