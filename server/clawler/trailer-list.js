// 抓取douban分类列表页数据
const puppeteer = require('puppeteer')

const url = `https://movie.douban.com/tag/#/?sort=T&range=6,10&tags=`

// 定时函数
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('开始抓取页面数据')

  const brower = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })

  const page = await brower.newPage()

  // 打开页面
  await page.goto(url, {
    waitUntil: 'networkidle2'  // 当网站空闲的时候，说明页面已经加载完毕
  })

  // 等待3秒 
  await sleep(3000)

  await page.waitForSelector('.more')  // 等待"加载更多"按钮出现

  // 这里只取到第2页
  for(let i = 0; i < 2; i++) {
    await sleep(3000)

    // 定义点击的函数
    await page.click('.more')
  }

  // 获取数据 用page.evalute()
  const result = await page.evaluate(() => {
    var $ = window.$
    var items = $('.list-wp a')
    var links = []  // 收集最后形成的数据
    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item)
        let doubanId = it.find('div').data('id')
        let title = it.find('.title').text()
        let rate = Number(it.find('.rate').text())
        let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')

        links.push({
          doubanId,
          title,
          rate,
          poster
        })
      })
    }
    return links
  })

  // 关闭浏览器
  brower.close()

  // console.log(result, result.length)
  
  process.send({result})    // 当一个子进程使用 process.send() 发送消息时会触发 'message' 事件
  process.exit(0)  // 退出进程
  
})()