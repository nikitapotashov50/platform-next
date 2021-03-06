const mongoose = require('mongoose')
const { extend, isArray } = require('lodash')
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
  //
  status: [ { type: ObjectId, ref: 'TaskVerification' } ],
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
  return model
    .find({
      enabled: true,
      postId: { $in: postIds }
    })
    .select('specific title postId taskId status replyTypeId')
    .populate([
      'specific.item',
      'replyTypeId',
      { path: 'taskId', select: 'title _id' },
      {
        path: 'status',
        select: 'status',
        options: {
          limit: 1,
          sort: { created: -1 }
        }
      }
    ])
    // .cache(40)
    .lean()
}

model.statics.getNotVerified = async function (params = {}) {
  let { programId, title } = params
  let match = { replyTypeId: 4 }
  match.targetProgram = Number(programId)
  if (title) match.title = title

  return mongoose.models.Task.aggregate([
    { $match: match },
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
    }},
    { $sample: { size: 2 } }
  ])
}

model.statics.getByStatus = function (status, params) {
  let model = this
  if (!isArray(status)) status = [ status ]

  return model.aggregate([
    { $match: params },
    { $lookup: {
      from: 'taskverifications',
      localField: '_id',
      foreignField: 'taskReplyId',
      as: 'statuses'
    }},
    { $unwind: '$statuses' },
    { $sort: {
      _id: 1,
      'statuses.created': 1
    }},
    { $group: {
      _id: {
        _id: '$_id',
        taskId: '$taskId'
      },
      status: { $last: '$statuses' }
    }},
    { $match: {
      'status.status': { $in: status }
    }},
    { $project: {
      _id: '$_id._id',
      taskId: '$_id.taskId',
      status: '$status.status'
    }}
  ])
}

/** ----------------------- MODEL METHODS ----------------------- */

model.methods.addStatus = async function (statusCode, params = {}) {
  let reply = this
  let status = await mongoose.models.TaskVerificationStatus.findOne({ code: statusCode })
  let data = { status: status._id, taskReplyId: reply._id }

  if (params.userId) data.userId = params.userId

  let verify = await mongoose.models.TaskVerification.create(data)
  reply.status.addToSet(verify)

  return reply.save()
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

model.methods.verify = async function (status, user) {
  let reply = this

  if (reply.replyTypeId === 4) {
    let [ task ] = await mongoose.models.Task.find({ _id: reply.taskId }).limit(1)
    if (!task) throw new Error('no task found')
    let [ plan ] = await mongoose.models.KnifePlan.find({ _id: task.type.item }).limit(1)
    if (!plan) throw new Error('no plan found')

    await plan.confirmPlan(status === 'approved')
  }

  return reply.addStatus(status, { userId: user._id })
}

module.exports = mongoose.model('TaskReply', model)
