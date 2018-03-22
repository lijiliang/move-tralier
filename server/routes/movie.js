const mongoose = require('mongoose')
const { controller, get, post, put } = require('../lib/decorator')
const { 
  getAllMovies, 
  getMovieDetail, 
  getRelativeMovies 
} = require('../service/movie')


@controller('/api/v0/movies')
export class movieController {
  // 获取所有的电影列表
  @get('/')
  async getMovies (ctx, next) {
    const { type, year } = ctx.query
    const movies = await getAllMovies(type, year)

    ctx.body = {
      success: true,
      data: movies
    }
  }

  // 获取单条电影数据
  @get('/:id')
  async getMovieDetail (ctx, next) {
    const id = ctx.params.id
    const movie = await getMovieDetail(id)
    const relativeMovies = await getRelativeMovies(movie)

    ctx.body = {
      data: {
        movie,
        relativeMovies
      },
      success: true
    }
  }
}