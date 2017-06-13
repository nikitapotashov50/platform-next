const mongoose = require('mongoose')
const { extend, pick } = require('lodash')
const { is } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

const model = new mongoose.Schema(extend({
  name: { type: String, default: '' },
  path: { type: String, required: true },
  mime: { type: String },
  meta: { type: Mixed, default: {} },
  //
  userId: { type: ObjectId, ref: 'Users' },
  //
  target: {
    model: { type: String },
    item: { type: ObjectId, refPath: 'target.model' }
  }
}, is))

model.statics.addToPost = async function (data, postId, add = {}) {
  data = pick(data, [ 'name', 'path', 'mime', 'created', 'enabled', 'userId', 'meta' ])
  data.target = { model: 'Post', item: postId }
  return this.create(data)
}

model.statics.block = async function (idArray) {
  let data = await this.find({ _id: { $in: idArray } })

  return Promise.all(data.map(el => {
    el.enabled = false
    return el.save()
  }))
}

module.exports = mongoose.model('Attachment', model)
