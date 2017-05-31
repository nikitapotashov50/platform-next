const moment = require('moment')
const mongoose = require('mongoose')
const { extend, pick } = require('lodash')
const { is, startFinish } = require('../utils/common')
const defaults = require('../utils/defaults')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  title: { type: String, required: true },
  content: { type: String, required: true },
  //
  userId: { type: ObjectId, ref: 'Users' },
  replyTypeId: { type: Number, ref: 'TaskReplyType' },
  //
  replies: [
    {
      userId: { type: ObjectId, ref: 'Users' },
      replyId: { type: ObjectId, ref: 'TaskReply' }
    }
  ],
  targetProgram: { type: Number, ref: 'Program' },
  target: {
    model: { type: String, enum: [ 'Group', 'Users' ] },
    item: { type: ObjectId, refPath: 'target.model' }
  },
  type: {
    model: { type: String, enum: [ 'KnifePlan' ] },
    item: { type: ObjectId, refPath: 'target.model' }
  }
}, is, startFinish))

model.statics.TaskReply = require('./reply')
model.statics.TaskReport = require('./report')
model.statics.KnifePlan = require('./types/knife')
model.statics.TaskVerification = require('./verification')

model.statics.defaults = defaults

let defaultTasks = [
  {
    title: 'Тестовое задание',
    content: 'Содержание задание может быть большое большое большое содержание задания может быть, дааа',
    replyTypeId: 1,
    targetProgram: 3,
    start_at: new Date('2017-05-27'),
    finish_at: new Date('2017-06-03')
  },
  {
    title: 'Тестовое задание 2',
    content: 'Содержание задание может быть большое большое большое содержание задания может быть, дааа',
    replyTypeId: 1,
    targetProgram: 3,
    start_at: new Date('2017-05-27'),
    finish_at: new Date('2017-06-10')
  },
  {
    title: 'Тестовое задание 3',
    content: 'Содержание задание может быть большое большое большое содержание задания может быть, дааа',
    replyTypeId: 1,
    targetProgram: 3,
    start_at: new Date('2017-05-27'),
    finish_at: new Date('2017-06-08')
  }
]

model.statics.initDefaults = async function (defaults) {
  let model = this
  // await model.remove()

  await Promise.all(defaultTasks.map(task => {
    return new Promise(async (resolve, reject) => {
      await model.create(task)
      resolve()
    })
  }))
}

/** ------------------------ MODEL STATICS ------------------------ */

model.statics.createKnifePlan = async function (user, data, options = {}) {
  /**
   * Для создания плана-кинжала надо
   * 1. понять кто цель плана
   * 2. создать план кинжал
   * 3. добавить егов задание
   * 4. созранить задание
   */
  let model = this

  // 1.
  let targetId = user._id
  if (options.targetId) {
    let [ targetUser ] = await mongoose.models.Users.find({ _id: options.targetId }).limit(1).select('_id')
    if (!targetUser) throw new Error(`no target user found with _id ${options.targetId}`)
    targetId = options.targetId
  }
  // 2.
  if (!data.goal || !data.action) throw new Error('no required fields specified')
  let plan = await mongoose.models.KnifePlan.createPlan(targetId, data)

  // 3.
  let today = moment()
  let taskData = {
    title: options.title,
    content: options.content,
    userId: user._id,
    target: { model: 'Users', item: targetId },
    replyTypeId: 4,
    targetProgram: options.programId,
    type: { model: 'KnifePlan', item: plan._id },
    start_at: today.toISOString(),
    finish_at: today.add(7, 'days').toISOString()
  }

  // 4.
  let task = await model.create(taskData)

  return { task, plan }
}

/** ------------------------ MODEL METHODS ------------------------ */

/** ----------------------- ADD REPLY METHOD ---------------------- */

model.methods.addReply = async function (user, post, add = {}) {
  let task = this
  let taskData = extend(
    pick(post, [ 'title', 'content' ]),
    {
      postId: post._id,
      userId: user._id,
      taskId: task._id,
      replyTypeId: task.replyTypeId
    },
    add
  )

  let reply = await mongoose.models.TaskReply.makeReply(taskData)

  task.replies.addToSet({
    userId: user._id,
    replyId: reply._id
  })

  await task.save()

  return reply
}

model.methods.checkReply = async function (user) {
  let task = this
  let [ reply ] = await mongoose.models.TaskReply
    .find({
      userId: user._id,
      taskId: task._id
    })
    .limit(1)
    .sort({ created: -1 })

  return reply
}

module.exports = mongoose.model('Task', model)

/** --------------------- DEFAULTS INITIATION ---------------------- */

// mongoose.models.Task.initDefaults(defaultTasks)
