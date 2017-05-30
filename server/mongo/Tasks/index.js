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
  replyTypeId: { type: Number, ref: 'TaskReplyTypes' },
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
  }
}, is, startFinish))

model.statics.TaskReply = require('./reply')
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
  await model.remove()

  await Promise.all(defaultTasks.map(task => {
    return new Promise(async (resolve, reject) => {
      await model.create(task)
      resolve()
    })
  }))
}

/** ------------------------ MODEL STATICS ------------------------ */

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
    }
  )

  let reply = await mongoose.models.TaskReply.makeReply(taskData)

  task.replies.addToSet({
    userId: user._id,
    replyId: reply._id
  })

  await task.save()

  return reply
}

module.exports = mongoose.model('Task', model)

/** --------------------- DEFAULTS INITIATION ---------------------- */

// mongoose.models.Task.initDefaults(defaultTasks)
