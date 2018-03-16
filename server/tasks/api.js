// 服务器端通过 request 向豆瓣 api 请求详细数据
// http://api.douban.com/v2/movie/subject/1764796
const rp = require('request-promise-native')

async function fetchMovie(item) {
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`

  const res = await rp(url)

  return res
}

;(async => {
  let movies = [
    { doubanId: 1485260,
      title: '本杰明·巴顿奇事',
      rate: 8.7,
      poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2192535722.jpg' 
    },
    { doubanId: 26387939,
      title: '摔跤吧！爸爸',
      rate: 9.1,
      poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2457983084.jpg' 
    } 
  ]

  movies.map(async movie => {
    let movieData = await fetchMovie(movie)

    try {
      movieData = JSON.parse(movieData)
      console.log(movieData.title)
      console.log(movieData.summary.replace('©豆瓣', '@Benson'))
    } catch(err){
      console.log(err)
    }
    // console.log(movieData)
  })
})()