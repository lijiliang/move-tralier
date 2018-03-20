const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const { resolve } = require('path') 
const { connect, initSchemas } = require('./database/init')
const mongoose = require('mongoose')

// 进入应用之前先连接数据库
;(async () => {
  await connect()
  
  // 初始化所有 Schema
  initSchemas()

  // 引入爬虫，抓取数据存到数据库
  require('./tasks/movie')
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