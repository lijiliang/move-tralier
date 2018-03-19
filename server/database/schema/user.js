// 用户数据 建模
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000

// 定义用户数据模型
const UserSchema = new Schema({
  username: {
    unique: true,  // 定义唯一索引
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
  }
})

mongoose.model('User', UserSchema)