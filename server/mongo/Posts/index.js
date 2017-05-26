const mongoose = require('mongoose')
const { is } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const visibilityTypes = [ 'self', 'all', 'selected', 'subscribers' ]

const model = new mongoose.Schema({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  views: { type: Number, default: 0 },
  //
  userId: { type: ObjectId, ref: 'Users', required: true },
  type: { type: Number, ref: 'PostsTypes' },
  comments: [
    { type: ObjectId, ref: 'Comments' }
  ],
  //
  visibility: { type: String, enum: visibilityTypes, default: 'all' },
  //
  is
})

model.statics.PostTypes = require('./types')

module.exports = mongoose.model('Post', model)
