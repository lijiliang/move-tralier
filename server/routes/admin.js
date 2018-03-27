const mongoose = require('mongoose')
const { 
  controller, 
  get, 
  post, 
  put, 
  auth, 
  admin,
  required
} = require('../lib/decorator')
const { 
  checkPassword 
} = require('../service/user')

const { 
  getAllMovies,
} = require('../service/movie')

@controller('/admin')
export class adminController {
  // 获取所有的电影列表
  @get('/movie/list')
  @auth
  @admin('admin')
  async getMoviesList (ctx, next) {
    const movies = await getAllMovies()

    ctx.body = {
      success: true,
      data: movies
    }
  }

  // 登录
  @post('/login')
  @required({
    body: ['email', 'password', 'abc']
  })
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