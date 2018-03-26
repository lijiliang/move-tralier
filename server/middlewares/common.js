// 通用中间件
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'

// 解析body
export const addBodyParser = app => {
  app.use(bodyParser())
}

// logger
export const addLogger = app => {
  app.use(logger())
}
