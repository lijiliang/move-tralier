const Koa = require('koa')
const views = require('koa-views')
const { join, resolve } = require('path')
const { connect, initSchemas } = require('./database/init')
const mongoose = require('mongoose')
const R = require('ramda')
const MIDDLEWARES = ['router', 'parcel']
// const MIDDLEWARES = ['router']

// 利用函数式编程 加载中间件数组
const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => join(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}

// 进入应用之前先连接数据库
;(async () => {
  await connect()
  
  // 初始化所有 Schema
  initSchemas()

  // 引入爬虫，抓取数据存到数据库
  // require('./tasks/movie')
  // require('./tasks/api')
  // require('./tasks/trailer')
  require('./tasks/qiniu')

  const app = new Koa()
  await useMiddlewares(app)

  // view中间件
  // app.use(views(resolve(__dirname, './views'), {
  //   extension: 'pug'
  // }))

  // app.use(async (ctx, next) => {
  //   await ctx.render('index', {
  //     you: 'HHH',
  //     me: 'Benson'
  //   })
  // })

  app.listen(3098)
  
})()

// 初始化路由
// app.use(routers.routes())
//    .use(routers.allowedMethods())




// view中间件
// app.use(views(resolve(__dirname, './views'), {
//   extension: 'pug'
// }))

// app.use(async (ctx, next) => {
//   await ctx.render('index', {
//     you: 'HHH',
//     me: 'Benson'
//   })
// })