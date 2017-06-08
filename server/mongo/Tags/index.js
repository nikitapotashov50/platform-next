const mongoose = require('mongoose')
const { extend } = require('lodash')
const { is } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  title: { type: String, default: '', required: true },
  target: {
    model: { type: String, enum: [ 'Post', 'Task' ] },
    item: { type: ObjectId, refPath: 'target.model' }
  },
  userId: { type: ObjectId, ref: 'Users' }
}, is))

model.statics.addToPost = function (title, post, userId) {
  if (title[0] === '#') title.substring(0, 1)

  let data = {
    title,
    userId,
    target: { model: 'Post', item: post._id }
  }

  return this.create(data)
}

module.exports = mongoose.model('Tag', model)
