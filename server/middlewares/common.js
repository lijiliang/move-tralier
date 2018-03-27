// 通用中间件
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import session from 'koa-session'

// 解析body
export const addBodyParser = app => {
  app.use(bodyParser())
}

// logger
export const addLogger = app => {
  app.use(logger())
}

// session
export const addSession = app => {
  app.keys = ['benson-trailer']

  const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000, // 24小时过期
    overwrite: true, // 是否可被重写
    httpOnly: false,
    signed: true,
    rolling: true
  }

  app.use(session(CONFIG, app))
}