const cp = require('child_process') // 引入子进程
const { resolve } = require('path')

;(async () => {
  const script = resolve(__dirname, '../clawler/trailer-list')

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

    invoked = false
    let err = code === 0 ? null : new Error('exit code ' + code)

    console.log(err)
  })

  // 拿到数据
  child.on('message', data => {
    let result = data.result

    console.log( result)
  })
})()