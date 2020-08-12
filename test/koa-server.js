const Koa = require('koa');
const app = new Koa();
const { debug } = require('../dist/index')

const main = ctx => {
  ctx.response.body = 'Hello World';
};

app.use(main);

debug(app.listen(3322))
