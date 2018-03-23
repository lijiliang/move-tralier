// 深度抓取封面图和视频地址
const cp = require('child_process') // 引入子进程
const { resolve } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

;(async () => {
  // 查询所有没有video的数据
  let movies = await Movie.find({
    $or: [
      {video: {$exists: false}},
      {video: null}
    ]
  }).exec()

  const script = resolve(__dirname, '../clawler/video')
  const child = cp.fork(script, [])  // child_process.fork 派出出一个子进程

  let invoked = false  // 标识这个脚本有没有被运行过
  // 处理错误
  child.on('error', err => {
    if (invoked) return
    
    invoked = true

    console.log(err) 
  })

  // 处理退出
  child.on('exit', code => {
    if (invoked) return

    invoked = true
    let err = code === 0 ? null : new Error('exit code ' + code)
 
    console.log(err)
  })

  // 拿到数据
  child.on('message', async data => {
    // https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2457983084.jpg

    let doubanId = data.doubanId
    let movie = await Movie.findOne({
      doubanId: doubanId
    }).exec()

    if (data.video) {
      movie.video = data.video
      movie.cover = data.cover

      await movie.save()
    } else {
      // 如果这个电影没有视频，直接删除
      await movie.remove()
    }
  })

  child.send(movies)

})()