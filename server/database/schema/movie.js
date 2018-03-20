// 电影数据 建模
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const ObjectId = Schema.Types.ObjectId

const MovieSchema = new Schema({
  doubanId: {
    unique: true,
    type: String
  },
  category: {
    type: ObjectId,
    ref: 'Category'  // 指向模型
  },
  rate: Number,
  title: String,
  summary: String,
  video: String,
  poster: String,
  cover: String,
  videoKey: String,  // 以下三个是七牛图床返回的数据
  posterKey: String,
  coverKey: String,
  rawTitle: String,
  movieType: [String],
  pubdate: Mixed,
  year: Number,
  tags: [String],
  meta: { // 电影创建及修改的时间
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

MovieSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

mongoose.model('Movie', MovieSchema)

