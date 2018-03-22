// 开发环境下，资源打包,由koa来提供对静态文件的访问能力
const Bundle = require('parcel-bundler')
const views = require('koa-views')
const serve = require('koa-static')

const { resolve } = require('path')
const r = path =>  resolve(__dirname, path)

const bundler = new Bundle(r('../../../src/index.html'), {
  publicUrl: '/', // 编译后依赖的路径
  watch: true
})

export const dev = async app => {
  await bundler.bundle()

  app.use(serve(r('../../../dist')))  // 静态资源目录
  app.use(views(r('../../../dist')), {
    extension: 'html'
  })

  app.use(async (ctx) => {
    await ctx.render('index.html')
  })
}