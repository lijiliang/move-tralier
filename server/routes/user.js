const mongoose = require('mongoose')
const { controller, get, post, put } = require('../lib/decorator')
const { 
  checkPassword 
} = require('../service/user')

@controller('/api/v0/user')
export class userController {
  // 获取所有的电影列表
  @get('/')
  async checkPassword (ctx, next) {
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