const mongoose = require('mongoose')
const { extend } = require('lodash')
const { is } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

const model = new mongoose.Schema(extend({
  name: { type: String, default: '' },
  path: { type: String, required: true },
  mime: { type: Mixed, default: {} },
  //
  userId: { type: ObjectId, ref: 'Users' },
  //
  target: {
    model: { type: String },
    item: { type: ObjectId, refPath: 'target.model' }
  }
}, is))

model.statics.addToPost = async function (data, postId, add = {}) {
  data.target = { model: 'Post', item: postId }
  return this.create(data)
}

module.exports = mongoose.model('Attachment', model)
