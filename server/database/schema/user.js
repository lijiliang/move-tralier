// 用户数据 建模
/**
 * bcrypt 加密
 * http://blog.csdn.net/original_heart/article/details/78538908?reload
 * http://blog.csdn.net/beijiyang999/article/details/78436876
 */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const SALT_WORK_FACTOR = 10  // 加盐的复杂度
const MAX_LOGIN_ATTEMPTS = 5 // 最大登录失败的数次
const LOCK_TIME = 2 * 60 * 60 * 1000  // 登录失败锁定时间为两小时

// 定义用户数据模型
const UserSchema = new Schema({
  username: {
    unique: true,  // 定义唯一索引,不允许重复
    required: true,
    type: String
  },
  email: {
    unique: true,
    required: true,
    type: String
  },
  password: {
    unique: true,
    type: String
  },
  loginAttempts: {  // 最大登录次数
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: Number,   // 帐号是否被锁定时间
  // 创建及修改的时间
  meta: {
    createdAt: {
      type: String,
      default: Date.now()
    },
    updatedAt: {
      type: String,
      default: Date.now()
    }
  }
})

// 添加一个虚拟字段来保存登录失败的次数
UserSchema.virtual('isLocked').get(function(){
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

// 保存数据之前的创建及修改时间处理
UserSchema.pre('save', function(next){
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

// 对密码进行加盐及加密的中间件
UserSchema.pre('save', function(next) {
  let user = this
  // 如果密码没有任何更改，直接返回
  if (!user.isModified('password')) return next()
  // 随机生成盐
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next()

    // 对密码进行加密
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (err) return next()
      
      // 生成加盐加密后的密码
      user.password = hash
      next()
    })
  })

  next()
})

// 实例方法
UserSchema.methods = {
  /**
   * 比较两个密码
   * _password 提交过来的原始密码
   * password 加盐加密后的密码
   */
  comparePassword: function(_password, password) {
    return new Promise((resolve, rject) => {
      // 对比两个密码，返回true或者false
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  },
  // 判断登录次数
  incLoginAttempts: function(user) {
    const that = this

    return new Promise((resolve, reject) => {
      if (that.lockUntil && that.lockUntil < Date.now()) {
        that.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            lockUntil: 1
          }
        }, (err) => {
          if (!err) resolve(true)
          else reject(err)
        })
      } else {
        let updates = {
          $inc: {
            loginAttempts: 1
          }
        }

        if (that.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && that.isLocked) {
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }

        // 更改数据
        that.update(updates, err => {
          if (!err) resolve(true)
          else reject(err)
        })
      }
    })
  }
}

mongoose.model('User', UserSchema)