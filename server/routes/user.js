const mongoose = require('mongoose')
const { controller, get, post, put } = require('../lib/decorator')
const { 
  checkPassword 
} = require('../service/user')

@controller('/admin')
export class userController {
  // 登录
  @post('/login')
  async login (ctx, next) {
    const { email, password } = ctx.request.body
    const matchData = await checkPassword(email, password)

    // 如果用户不存在
    if (!matchData.user) {
      return (ctx.body = {
        success: false,
        err: '用户不存在'
      })
    }

    // 用户和密码正确，直接返回true
    if (matchData.match) {
      return (ctx.body = {
        success: true
      })
    }

    return (ctx.body = {
      success: false,
      err: '密码不正确'
    })
  }

}