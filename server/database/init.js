// 初始化 Mongodb
const mongoose = require('mongoose')
const glob = require('glob')
const { resolve } = require('path') 
const db = 'mongodb://127.0.0.1:27017/douban-tralier'

// 让mongoose的promise直接用标准的promise
mongoose.Promise = global.Promise

// 引入数据模型 Schema
exports.initSchemas = () => {
  // 拿到 schema 文件下的所有js,并自动引入，不需要每个js都module.exports
  glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}
 
// 初始化管理员数据
exports.initAdmin = async () => {
  const User = mongoose.model('User')
  let user = await User.findOne({
    username: 'Benson'
  })

  if (!user) {
    user = new User({
      username: 'Ben',
      email: '1951828835@qq.com',
      password: '12345qwer',
      role: 'admin'
    })
  }

  await user.save()
}

// 连接数据库
exports.connect = () => {
  let maxConnectTimes = 0  // 连接失败，重连的次数

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
    
    // 连接mongodb数据库
    mongoose.connect(db)
  
    // 如果发生网络断开，重连
    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库挂了！')
      }
    })
  
    mongoose.connection.on('error', err => {
      // reject(err)
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库挂了！')
      }
    })
  
    mongoose.connection.once('open', () => {
      // 测试写入数据库
      // const Dog = mongoose.model('Dog', {name: String})
      // const doga = new Dog({name: '阿尔法'})
      // doga.save().then(() => {
      //   console.log('wang')
      // })

      resolve()
      console.log('MongoDB Connected Successfully!')
    })
  })
}