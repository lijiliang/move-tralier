// 上传图片和视频到七牛
const qiniu = require('qiniu')
const nanoid = require('nanoid') // 随机生成一个id
const config = require('../config')

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()  // 构建配置类
const client = new qiniu.rs.BucketManager(mac, cfg)

const uploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    // 抓取网络资源到空间
    client.fetch(url, bucket, key, (err, ret, info) => {
      if (err) {
        reject(err)
      } else {
        if (info.statusCode === 200) {
          resolve({key})
        }else {
          reject(info)
        }
      }
    })
  })
}

;(async () => {
  let movies = [{ video: 'http://vt1.doubanio.com/201803161745/c3cfe55ac68c5ba156eeed560f5c870f/view/movie/M/302160387.mp4',
    doubanId: '26387939',
    cover: 'https://img1.doubanio.com/img/trailer/medium/2457624899.jpg?',
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2457983084.jpg'
  }]

  movies.map(async movie => {
    if (movie.video && !movie.key) {
      try {
        console.log('开始传 video')
        let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')  // 上传视频
        console.log('开始传 cover')
        let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png')  // 封面图
        console.log('开始传 poster')
        let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')  // 海报

        console.log(videoData, coverData, posterData)
        if (videoData.key) {
          movie.videoKey = videoData.key
        }
        if (coverData.key) {
          movie.coverKey = videoData.key
        }
        if (posterData.key) {
          movie.posterKey = posterData.key
        }

        console.log(movie)
      } catch(err){
        console.log(err)
      }
    }
  })

})()