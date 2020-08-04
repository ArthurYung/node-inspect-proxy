# server-inspect-proxy
Node inspect proxy, you can start remotely debugging with it.

## Install
```
npm i server-inspect-proxy
```
or
```
yarn add server-inspect-proxy
```

## Usage
You have to add NODE_OPTIONS=--inspect instead of started with the --inspect switch.   
```bash
NODE_OPTIONS=--inspect node ./index.js
```
```js
// index.js
const { debug } = require('server-inspect-proxy')
const { createServer } = require('http')

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.end("success");
}).listen(3320);

debug(server)
```
And open chrome://devtools/bundled/js_app.html?ws=YOUR_APP_HOST/\_\_debug\_\_   

![20200805005432](http://cdn.toofook.com/markdown/20200805005432.png)
