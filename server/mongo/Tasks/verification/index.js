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

  let list = await model.aggregate([
    { $group: {
      _id: '$taskReplyId',
      status: { $last: '$status' }
    }},
    { $unwind: '$status' },
    { $match: {
      status: { $nin: [ 3, 4 ] }
    }},
    { $lookup: {
      from: 'taskreplies',
      localField: '_id',
      foreignField: '_id',
      as: 'reply'
    }},
    { $unwind: '$reply' },
    { $lookup: {
      from: 'tasks',
      localField: 'reply.taskId',
      foreignField: '_id',
      as: 'task'
    }},
    { $unwind: '$task' },
    { $match: {
      'task.targetProgram': params.programId
    }},
    { $group: {
      _id: '$task.title',
      count: { $sum: 1 }
    }}
  ])
    // .find({
    //   enabled: true,
    //   status: { $nin: [ 3, 4 ] }
    // })
    // .distinct('taskReplyId')
    // .lean()

  return list
}

// model.statics.add = async function (status, meta) {
//   if (!meta.user || !meta.reply) throw new Error('no required data specified')
//   let data = {}
//   return this.create({})
// }

// TODO: сделать этот метод рабочии
model.statics.getRejectedRepliesCount = async function (userId, programId) {
  let model = this
  let data = await model.aggregate([
    { $match: {
      userId
    }}
  ])

  return data.length
}

module.exports = mongoose.model('TaskVerification', model)
