const mongoose = require('mongoose')
const { extend, isArray } = require('lodash')
const { is } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  content: { type: String, default: '' },
  //
  userId: { type: ObjectId, ref: 'Users', required: true },
  //
  target: {
    model: { type: String },
    item: { type: ObjectId, refPath: 'target.model' }
  }
}, is))

model.statics.getForPosts = async function (posts, { limit, reversed }) {
  let model = this
  let structured = {}

  await Promise.all(posts.map(post => {
    return new Promise(async (resolve, reject) => {
      let list = await model.getForPost(post, { limit, reversed })
      structured[post._id] = list
      resolve()
    })
  }))

  return structured
}

model.statics.getForPost = async function (post, { limit, offset, reversed }) {
  let model = this
  let query = model
    .find({
      _id: { $in: post.comments || [] },
      enabled: true
    })
    .select('_id content userId created')

  if (limit && reversed && post.comments.length >= limit) {
    query.limit(Number(limit)).skip(post.comments.length - limit)
  } else {
    if (limit) query.limit(Number(limit))
    if (offset) query.skip(Number(offset))
  }

  let list = await query.exec()

  return list
}

model.statics.addToPost = async function (data, postId) {
  data.target = { model: 'Post', item: postId }
  let comment = await this.create(data)
  return comment
}

model.statics.getObjectById = async function (idArray) {
  if (!isArray(idArray)) idArray = [ idArray ]

  let data = await this.find({
    _id: { $in: idArray },
    enabled: true
  })

  if (!data.length) return {}

  data = data.reduce((obj, item) => {
    obj[item._id] = item
    return obj
  }, {})

  return data
}

model.methods.block = async function () {
  this.enabled = false
  await this.save()
  return this
}

module.exports = mongoose.model('Comment', model)
