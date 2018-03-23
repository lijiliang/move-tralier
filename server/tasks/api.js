// 服务器端通过 request 向豆瓣 api 请求详细数据
const rp = require('request-promise-native')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

async function fetchMovie (item) {
  const url = `http://api.douban.com/v2/movie/${item.doubanId}`
  // console.log(url)
  let res = await rp(url)

  try {
    res = JSON.parse(res)
  } catch (err) {
    console.log(err)
    res = null
  }

  return res
}

;(async () => {
    // let movies = [
  //   { doubanId: 1485260,
  //     title: '本杰明·巴顿奇事',
  //     rate: 8.7,
  //     poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2192535722.jpg' 
  //   },
  //   { doubanId: 26387939,
  //     title: '摔跤吧！爸爸',
  //     rate: 9.1,
  //     poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2457983084.jpg' 
  //   } 
  // ]
  // movies.map(async movie => {
  //   let movieData = await fetchMovie(movie)

  //   try {
  //     movieData = JSON.parse(movieData)
  //     console.log(movieData.title)
  //     console.log(movieData.summary)
  //   } catch(err){
  //     console.log(err)
  //   }
  // })

  // 查询数据库里面的初始化数据
  let movies = await Movie.find({
    $or: [ // 找出符合以下条件的数据
      {summary: {$exists: false}},
      {summary: null},
      {year: { $exists: false } },
      {title: ''},
      {summary: ''}
    ]
  })
 
  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i]
    let movieData = await fetchMovie(movie)

    if (movieData) {
      let tags = movieData.tags || []

      movie.tags = movie.tags || []  // 标签
      movie.summary = movieData.summary || ''  // 简介
      movie.title = movieData.alt_title || movieData.title || '' // 标题
      movie.rawTitle = movieData.title || ''

      if (movieData.attrs) {
        movie.year = movieData.attrs.year[0] || 2500  // 年份
        movie.movieTypes = movieData.attrs.movie_type || []

      // 类目  类型
      for (let i = 0; i < movie.movieTypes.length; i++){
        let item = movie.movieTypes[i]
         // 查询 类目 
        let cat = await Category.findOne({
          name: item
        })

        if (!cat) {
          cat = new Category({
            name: item,
            movies: [movie._id]
          })
        } else {
          // 没有类目，则创建
          if (cat.movies.indexOf(movie._id) > -1) {
            cat.movies.push(movie._id)
          }
        }

        await cat.save()

        // 如果当前 movie.category 不存在 ，则创建
        if (!movie.category) {
          movie.category.push(cat._id)
        } else {
          if (movie.category.indexOf(cat._id) === -1) {
            movie.category.push(cat._id)
          }
        }
       }

        // 如果条目类型是电影则为上映日期，如果是电视剧则为首Ï日期
        let dates = movieData.attrs.pubdate || []
        let pubdates = []

        dates.map(item => {
          if (item && item.split('(').length > 0) {
            let parts = item.split('(')
            let date = parts[0]
            let country = '未知'

            if (parts[1]) {
              country = parts[1].split(')')[0]
            }
            pubdates.push({
              date: new Date(date),
              country
            })
          }
        })
        movie.pubdate = pubdates

      }

      // 标签
      tags.forEach(tag => {
        movie.tags.push(tag.name)
      })

      // console.log(movie)
      // 保存处理完后的数据到数据库
      await movie.save()
    }
  }

})()


