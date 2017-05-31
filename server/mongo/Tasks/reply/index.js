const mongoose = require('mongoose')
const { extend } = require('lodash')
const { is } = require('../../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  title: { type: String },
  content: { type: String },
  //
  userId: { type: ObjectId, ref: 'Users' },
  postId: { type: ObjectId, ref: 'Posts' },
  taskId: { type: ObjectId, ref: 'Tasks' },
  replyTypeId: { type: Number, ref: 'TaskReplyType' },
  specific: {
    model: { type: String, enum: [ 'Goal', 'Task', 'TaskReport' ] },
    item: { type: ObjectId, refPath: 'specific.model' }
  }
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

model.statics.makeReply = async function (data) {
  let model = this

  // создаем ответ
  let reply = await model.create(data)
  // добавляем статус к ответу
  await reply.addStatus('pending')

  return reply
}

/** ----------------------- MODEL METHODS ----------------------- */

model.methods.addStatus = async function (statusCode, params) {
  let reply = this
  let status = await mongoose.models.TaskVerificationStatus.findOne({ code: statusCode })

  return mongoose.models.TaskVerification.create({
    status: status._id,
    taskReplyId: reply._id
  })
}

model.methods.getStatus = async function () {
  let reply = this

  return mongoose.models.TaskVerification
    .find({
      enabled: true,
      taskReplyId: reply._id
    })
    .select('_id status')
    .populate({ path: 'status', select: '_id code title' })
    .limit(1)
    .sort({ created: -1 })
}

module.exports = mongoose.model('TaskReply', model)
