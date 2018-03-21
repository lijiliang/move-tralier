// 查询用户相关数据
const mongoose = require('mongoose')
const User = mongoose.model('User')

// 判断密码是否一致
export const checkPassword = async (email, password) => {
  let match = false
  const user = await User.findOne({email})

  if (user) {
    match = await user.comparePassword(password, user.password)
  }

  return {
    match,
    user
  }
}