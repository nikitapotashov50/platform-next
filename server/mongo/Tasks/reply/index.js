const mongoose = require('mongoose')
const { extend, pick } = require('lodash')
const { is } = require('../../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  title: { type: String, required: true },
  content: { type: String, required: true },
  //
  userId: { type: ObjectId, ref: 'Users' },
  postId: { type: ObjectId, ref: 'Posts' },
  taskId: { type: ObjectId, ref: 'Tasks' },
  replyTypeId: { type: Number, ref: 'TaskReplyTypes' }
}, is))

model.virtual('verification', {
  ref: 'TaskVerification',
  localField: '_id',
  foreignField: 'taskReplyId'
})

model.statics.ReplyTypes = require('./type')

/** ----------------------- MODEL STATICS ----------------------- */

/**
 * get reply info
 */
model.statics.getInfo = async function (idArray = [], user) {
  let model = this
  let list = await model
    .find({
      taskId: { $in: idArray },
      userId: user._id
    })
    .select('_id title content postId taskId verification')
    .populate({
      path: 'verification',
      select: '_id status'
    })

  return list
}

/** ----------------------- MODEL METHODS ----------------------- */

model.methods.getStatus = async function () {
  let reply = this
}

module.exports = mongoose.model('TaskReply', model)
