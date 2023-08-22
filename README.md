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
You can define the inspection port and which will be automatically proxied.
```bash
NODE_OPTIONS=--inspect node ./index.js
node --inspect ./index.js
node --inspect --inspect-port=xxx ./index.js
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

![20200805005432](https://cdn-qiniu.bruceau.com/markdown/20200805005432.png)

## 1.0.6
Use in koa/express:
```js
const Koa = require('koa');
const app = new Koa();
const { debug } = require('../dist/index')

const main = ctx => {
  ctx.response.body = 'Hello World';
};

app.use(main);

debug(app.listen(3322))
```

