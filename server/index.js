const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const { resolve } = require('path') 
const { connect } = require('./database/init')

// 进入应用之前先连接数据库
;(async () => {
  await connect()
})()

// view中间件
app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))

app.use(async (ctx, next) => {
  await ctx.render('index', {
    you: 'HHH',
    me: 'Benson'
  })
})

app.listen(3098)