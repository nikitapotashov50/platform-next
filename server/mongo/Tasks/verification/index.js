const mongoose = require('mongoose')
const { extend } = require('lodash')
const { is } = require('../../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  content: { type: String },
  //
  userId: { type: ObjectId, ref: 'Users' },
  taskReplyId: { type: ObjectId, ref: 'TaskReply', required: true },
  status: { type: Number, ref: 'TaskVerificationStatus', required: true }
}, is))

model.statics.VerificationStatuses = require('./status')

model.statics.getLastForReplies = async function (params = {}) {
  let model = this
  let list = await model.aggregate([
    { $match: params },
    { $sort: { created: 1 } },
    { $group: {
      _id: '$taskReplyId',
      date: { $last: '$created' },
      status: { $addToSet: '$status' }
    }}
  ])

  return list
}

module.exports = mongoose.model('TaskVerification', model)
