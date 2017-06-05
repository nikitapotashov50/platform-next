const mongoose = require('mongoose')
const { extend } = require('lodash')
const { is } = require('../../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  title: { type: String },
  content: { type: String },
  //
  userId: { type: ObjectId, ref: 'Users', index: true },
  postId: { type: ObjectId, ref: 'Post', index: true },
  taskId: { type: ObjectId, ref: 'Task', index: true },
  replyTypeId: { type: Number, ref: 'TaskReplyType', index: true },
  specific: {
    model: { type: String, enum: [ 'Goal', 'KnifePlan', 'TaskReport' ] },
    item: { type: ObjectId, refPath: 'specific.model', index: true }
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
  if (reply.replyTypeId === 4) await reply.addStatus('pending')
  else await reply.addStatus('approved')

  return reply
}

model.statics.getByPostIds = async function (postIds) {
  let model = this
  // return new Promise(async (resolve, reject) => {
  return model
    .find({
      enabled: true,
      postId: { $in: postIds }
    })
    .select('specific title postId replyTypeId')
    .populate([ 'specific.item', 'replyTypeId' ])
    // .cache(40)
    .lean()

    // resolve(replies.reduce(async (obj, item) => {
    //   if (item.specific) obj[item.postId] = { type: item.replyTypeId.code, data: item.specific.item }
    //   return obj
    // }, {}))
  // })
}

model.statics.getNotVerified = async function (programId) {
  return mongoose.models.Task.aggregate([
    { $match: {
      targetProgram: Number(programId),
      replyTypeId: 4
    }},
    { $project: {
      _id: 1,
      title: 1
    }},
    { $lookup: {
      from: 'taskreplies',
      localField: '_id',
      foreignField: 'taskId',
      as: 'reply'
    }},
    { $unwind: '$reply' },
    { $project: {
      task: {
        _id: '$_id',
        title: '$title'
      },
      reply: '$reply._id',
      _id: 0
    }},
    { $lookup: {
      from: 'taskverifications',
      localField: 'reply',
      foreignField: 'taskReplyId',
      as: 'verifications'
    }},
    { $unwind: '$verifications' },
    { $sort: {
      'verifications.created': 1
    }},
    { $group: {
      _id: {
        reply: '$reply',
        task: '$task'
      },
      verification: { $last: '$verifications' }
    }},
    { $match: {
      'verification.status': { $nin: [ 3, 4 ] }
    }},
    { $project: {
      _id: 0,
      task: '$_id.task',
      reply: '$_id.reply',
      status: '$verification'
    }}
  ])
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

model.methods.approve = async function (data, user) {
  let reply = this
  return mongoose.models.TaskVerification.add('approved', { reply, user, data })
}
model.methods.reject = async function (data, user) {
  let reply = this
  return mongoose.models.TaskVerification.add('rejected', { reply, user, data })
}

module.exports = mongoose.model('TaskReply', model)
