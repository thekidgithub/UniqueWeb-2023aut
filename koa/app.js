const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cookie = require('koa-cookie').default;
const controller = require('./controller');
const app = new Koa();

app.use(bodyParser());
app.use(cookie());

app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  await next();
});

app.use(controller());

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
