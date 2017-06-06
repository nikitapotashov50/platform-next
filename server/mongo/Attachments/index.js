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

model.statics.addToPost = async function (data, post, add = {}) {
  let final = { name: data.key, path: data.url }
  final.target = { model: 'Post', item: post._id }
  if (add.userId) final.userId = add.userId

  let attachment = await this.create(final)

  post.attachments.addToSet(attachment)
  await post.save()

  return attachment
}

module.exports = mongoose.model('Attachment', model)
