// 服务器端通过 request 向豆瓣 api 请求详细数据
// http://api.douban.com/v2/movie/1764796
const rp = require('request-promise-native')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

async function fetchMovie(item) {
  const url = `http://api.douban.com/v2/movie/${item.doubanId}`
  const res = await rp(url)
  let body

  try {
    body = JSON.parse(res)
  } catch(err) {
    console.log(err)
  }
  console.log(body)
  return body
}

;(async => {
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
  //     console.log(movieData.summary.replace('©豆瓣', '@Benson'))
  //   } catch(err){
  //     console.log(err)
  //   }
  // })

  // 查询数据库里面的初始化数据
  let movies = await Movie.find({
    $or: [ // 查出符合以下条件的数据
      { summary: { $exists: false }},
      { summary: null },
      { year: { $exists: false } },
      { title: '' },
      { summary: '' }
    ]
  })


  for(let i = 0; i < movies.length; i++) {
    let movie = movies[i]
    let movieData = await fetchMovie(movie)

    if (movieData) {
      let tags = movieData.tags || []

      movie.tags = movie.tags || []
      movie.summary = movieData.summary || ''
      movie.title = movieData.alt_title || movieData.title || ''
      movie.rowTitle = movieData.rowTitle || movieData.title || ''

      if (movieData.attrs) {
        movie.movieTypes = movieData.attrs.movie_type || []
        movie.year = movieData.attrs.year[0] || 2500

        for (let i = 0; i < movie.movie_type.length; i++) {
          let item = movie.movieTypes[i]
          let cat = await Category.findOne({
            name: item
          })

          if (!cat) {
            cat = new Category({
              name: item,
              movies: [movie._id]
            })
          } else {
            if (cat.movies.indexOf(movie._id) === -1) {
              cat.movies.push(movie._id)
            }
          }

          await cat.save()

          if (!movie.category) {
            movie.category.push(cat._id)
          } else {
            if (movie.category.indexOf(cat._id) === -1) {
              movie.category.push(cat._id)
            }
          }
        }

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
              data: new Date(date),
              country
            })
          }
        })

        movie.pubdate = pubdates
        
        tags.forEach(tag => {
          movie.tags.push(tag.name)
        })

        console.log(movie)
        await movie.save()
      }
    }
  }

})()