// 生产环境 、,由koa来提供对静态文件的访问能力
const views = require('koa-views')
const serve = require('koa-static')

const { resolve } = require('path')
const r = path =>  resolve(__dirname, path)


export const dev = async app => {

  app.use(serve(r('../../../dist')))  // 静态资源目录
  app.use(views(r('../../../dist')), {
    extension: 'html'
  })

  app.use(async (ctx) => {
    await ctx.render('index.html')
  })
}