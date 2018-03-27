const mongoose = require('mongoose')
const { 
  controller, 
  get, 
  post, 
  put, 
  del,
  auth, 
  admin,
  required
} = require('../lib/decorator')
const { 
  checkPassword 
} = require('../service/user')

const { 
  getAllMovies,
  findAndRemove
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

  // 删除单个电影
  @del('/movies')
  @required({
    query: ['id']
  })
  async removeMovie (ctx, next) {
    const id = ctx.query.id
    const movie = await findAndRemove(id)
    const movies = await getAllMovies()

    ctx.body = {
      success: true,
      data: movies
    }
  }

  // 登录
  @post('/login')
  @required({
    body: ['email', 'password']
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
      const user = matchData.user
      // 设置session
      ctx.session.user = {
        _id: user._id,
        email: user.email,
        role: user.role,
        username: user.username
      }

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