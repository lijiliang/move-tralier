// 路由 装饰器
const KoaRouter = require('koa-router')
const glob = require('glob')
const { resolve } = require('path')
const _ = require('lodash')
const R = require('ramda')

const SymbolPrefix = Symbol('prefix')
const routerMap = new Map()
const isArray = c => _.isArray(c) ? c : [c]

export class Route {
  constructor (app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new KoaRouter()
  }

  init () {

    glob.sync(resolve(this.apiPath, '**/*.js')).forEach(require)

    for (let [conf, controller] of routerMap) {
      const controllers = isArray(controller)
      const prefixPath = conf.target[SymbolPrefix]

      if (prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path

      this.router[conf.method](routerPath, ...controllers)
    }

    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}

const normalizePath = path => path.startsWith('/') ? path : `/${path}`

const router = conf => (target, key, descriptor) => {
  conf.path = normalizePath(conf.path)

  routerMap.set({
    target: target,
    ...conf
  }, target[key])
}

export const controller = path => target => (target.prototype[SymbolPrefix] = path)

export const get = path => router({
  method: 'get',
  path: path
})

export const post = path => router({
  method: 'post',
  path: path
})

export const put = path => router({
  method: 'put',
  path: path
})

export const del = path => router({
  method: 'delete',
  path: path
})

export const use = path => router({
  method: 'use',
  path: path
})

export const all = path => router({
  method: 'all',
  path: path
})


const changeToArr = R.unless(
  R.is(isArray),
  R.of
)

const decorate = (args, middleware) => {
  let [target, key, descriptor] = args

  target[key] = isArray(target[key])
  target[key].unshift(middleware)

  return descriptor
}

export const convert = middleware => (...args) => decorate(args, middleware)

// 验证是否登录
export const auth = convert(async (ctx, next) => {
  console.log(ctx.session)
  if (!ctx.session.user) {
    return (
      ctx.body = {
        success: false,
        errCode: 401,
        errMsg: '登陆信息已失效, 请重新登陆'
      }
    )
  }
  await next()
})

// 验证是否是管理员
export const admin = roleExpected => convert(async (ctx, next) => {
  const { role } = ctx.session.user

  // 权限组
  // const rules = {
  //   admin: [1,4,5],
  //   superAdmin: [1,2,3,4]
  // }

  if (!role || role !== roleExpected) {
    return (
      ctx.body = {
        success: false,
        errCode: 403,
        errMsg: '你没有权限，来错地方了'
      }
    )
  }
  await next()
})

// 参数合法性校验  判断前端传过来的数据是否缺失
// export const required = rules => convert(async (ctx, next) => {
//   let errors = []

//   const checkRules = R.forEachObjIndexed(
//     (value, key) => {
//       errors = R.filter(i => !R.has(i, ctx, ctx.request[key]))(value)
//     }
//   )

//   checkRules(rules)
//   console.log(rules, errors)
//   if (errors.length) {
//     return (
//         ctx.body = {
//         success: false,
//         code: 412,
//         err: `${errors.join(',')} is required`
//       }
//     )
//   }

//   await next()
// })

/**
 * 参数合法性校验  判断前端传过来的数据是否缺失
 * @required({
 *   body: ['name', 'password']
 * })
 */
export const required = paramsObj => convert(async (ctx, next) => {
  let errs = []

  R.forEachObjIndexed(
    (val, key) => {
      errs = errs.concat(
        R.filter(
          name => !R.has(name, ctx.request[key])
        )(val)
      )
    }
  )(paramsObj)

  if (!R.isEmpty(errs)) {
    return (
      ctx.body = {
        success: false,
        errCode: 412,
        errMsg: `${R.join(', ', errs)} is required`
      }
    )
  }
  await next()
})