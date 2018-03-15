const Koa = require('koa')
const app = new Koa()
const { normal } = require('./tpl/index')
app.use(async (ctx, next) => {
  ctx.type = 'html'
  ctx.body = normal
  await next()
})

app.listen(3098)