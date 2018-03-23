// 根据详情页抓取视频封面图和视频地址
// 封面图在当前页，视频地址在另外一个页面
const puppeteer = require('puppeteer')

const base = 'https://movie.douban.com/subject/'
const trailerBase = 'https://movie.douban.com/trailer/'

// 定时函数
const sleep = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

// https://github.com/GoogleChrome/puppeteer/issues/290
process.on('message', async (movies) => { 
  console.log('开始访问目标页面')

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'], 
    dumpio: false
  })
  const page = await browser.newPage()

  for (let i = 0; i < movies.length; i++) {
    let doubanId = movies[i].doubanId

    // 打开页面
    await page.goto(base + doubanId, {
      waitUntil: 'networkidle2' // 当网站空闲的时候，说明页面已经加载完毕
    })
     // 等待1秒 
    await sleep(1000)

    // 抓取详情页数据
    const result = await page.evaluate(() => {
      var $ = window.$
      var it = $('.related-pic-video')

      // 判断这部电影有没有封面图
      if (it && it.length > 0) {
        var link = it.attr('href') // 要跳转进去的详情页
        var cover = it.find('img').attr('src')  // 封面图

        return {
          link,
          cover
        }
      }

      return {}
    })

    // 根据详情页返回的视频地址进行抓取视频
    let video

    if (result.link) {
      await page.goto(result.link, {
        waitUntil: 'networkidle2'
      })
      await sleep(1000)

      video = await page.evaluate(() => {
        var $ = window.$
        var it = $('source')

        if (it && it.length > 0) {
          return it.attr('src')
        }

        return ''
      })
    }

    // 返回最终数据
    const data = {
      video,
      doubanId,
      cover: result.cover
    }

    process.send(data) // 当一个子进程使用 process.send() 发送消息时会触发 'message' 事件
  }

  browser.close()  // 关闭浏览器
  process.exit(0) // 退出进程
})
