const Koa = require('koa')
const app = new Koa()
const { htmlTpl, ejsTpl, pugTpl } = require('./tpl/index')
const ejs = require('ejs')
const pug = require('pug')

app.use(async (ctx, next) => {
  ctx.type = 'html'
  // ctx.body = htmlTpl

  // ctx.body = ejs.render(ejsTpl, {
  //   you: 'you',
  //   me: 'Benson'
  // })

  ctx.body = pug.render(pugTpl, {
    you: 'you',
    me: 'Benson'
  })
  await next()
})

app.listen(3098)