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

module.exports = mongoose.model('TaskVerification', model)
