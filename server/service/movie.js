// 查询电影相关数据
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

// 查询所有的电影列表
export const getAllMovies = async (type, year) => {
  // 查询条件
  let query = {}

  if (type) {
    query.movieTypes = {
      $in: [type]
    }
  }

  if (year) {
    query.year = year
  }
  
  const movies = await Movie.find(query)

  return movies
}

// 查询单条电影数据
export const getMovieDetail = async (id) => {
  const movie = await Movie.findOne({_id: id})

  return movie
}

// 查询类型 对应的所有电影
export const getRelativeMovies = async (movie) => {
  const relativeMovies = await Movie.find({
    movieTypes: {
      $in: movie.movieTypes
    }
  })

  return relativeMovies
}

// 删除单个电影
export const findAndRemove = async (id) => {
  const movie = await Movie.findOne({_id: id})

  // 如存在，则删除
  if (movie) {
    await movie.remove()
  }
}