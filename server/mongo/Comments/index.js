const mongoose = require('mongoose')
const { is } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema({
  content: { type: String, default: '' },
  //
  userId: { type: ObjectId, ref: 'Users', required: true },
  //
  is
})

module.exports = mongoose.model('Comment', model)
