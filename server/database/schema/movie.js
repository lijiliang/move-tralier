// 电影数据 建模
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { Mixed, ObjectId } = Schema.Types  // Mixed数据类型
 
// 定义电影数据模型
const MovieSchema = new Schema({
  doubanId: String,
  // category: {
  //   type: ObjectId,
  //   ref: 'Category'  // 指向模型
  // },
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
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// , { collection: 'movies'})
//这里mongoose.Schema最好要写上第二个参数，明确指定到数据库中的哪个表取数据

MovieSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

mongoose.model('Movie', MovieSchema)