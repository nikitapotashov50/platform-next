const mongoose = require('mongoose')
const { extend } = require('lodash')
const { is } = require('../../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  content: { type: String },
  //
  userId: { type: ObjectId, ref: 'Users', index: true },
  taskReplyId: { type: ObjectId, ref: 'TaskReply', required: true, index: true },
  status: { type: Number, ref: 'TaskVerificationStatus', required: true }
}, is))

model.statics.VerificationStatuses = require('./status')

model.statics.getLastForReplies = async function (params = {}) {
  let model = this
  let list = await model
    .find({
      enabled: true,
      status: { $nin: [ 3, 4 ] }
    })
    .distinct('taskReplyId')
    .lean()

  return list
}

module.exports = mongoose.model('TaskVerification', model)
