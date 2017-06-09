const moment = require('moment')
const mongoose = require('mongoose')
const { extend, pick } = require('lodash')
const { is, startFinish } = require('../utils/common')
const defaults = require('../utils/defaults')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  title: { type: String, required: true },
  content: { type: String, required: true },
  description: { type: String, default: '' },
  //
  userId: { type: ObjectId, ref: 'Users', index: true },
  replyTypeId: { type: Number, ref: 'TaskReplyType', index: true },
  //
  replies: [
    {
      userId: { type: ObjectId, ref: 'Users' },
      replyId: { type: ObjectId, ref: 'TaskReply' }
    }
  ],
  targetProgram: { type: Number, ref: 'Program', index: true },
  target: {
    model: { type: String, enum: [ 'Group', 'Users' ] },
    item: { type: ObjectId, refPath: 'target.model', index: true }
  },
  type: {
    model: { type: String, enum: [ 'KnifePlan' ] },
    item: { type: ObjectId, refPath: 'target.model', index: true }
  },
  replyMeta: {
    title: { type: String, default: '' },
    content: { type: String },
    start_at: { type: Date },
    finish_at: { type: Date }
  }
}, is, startFinish))

model.statics.TaskReply = require('./reply')
model.statics.TaskReport = require('./report')
model.statics.KnifePlan = require('./types/knife')
model.statics.TaskVerification = require('./verification')

model.statics.defaults = defaults

let defaultTasks = [
  {
    title: 'Поставить план-кинжал',
    content: 'Содержание задание может быть большое большое большое содержание задания может быть, дааа',
    replyTypeId: 2,
    targetProgram: 3,
    start_at: new Date('2017-05-27'),
    finish_at: new Date('2017-06-03'),
    replyMeta: {
      title: 'План кинжал №1',
      start_at: new Date('2017-06-03'),
      finish_at: new Date('2017-06-10')
    }
  },
  {
    title: 'Поставить план-кинжал',
    content: 'Содержание задание может быть большое большое большое содержание задания может быть, дааа',
    replyTypeId: 2,
    targetProgram: 2,
    start_at: new Date('2017-05-27'),
    finish_at: new Date('2017-06-13'),
    replyMeta: {
      title: 'План кинжал №5',
      start_at: new Date('2017-06-03'),
      finish_at: new Date('2017-06-13')
    }
  },
  {
    title: 'Поставить план-кинжал!',
    content: 'Содержание задание может быть большое большое большое содержание задания может быть, дааа',
    replyTypeId: 2,
    targetProgram: 3,
    start_at: new Date('2017-05-27'),
    finish_at: new Date('2017-06-13'),
    replyMeta: {
      title: 'План кинжал №2',
      start_at: new Date('2017-06-03'),
      finish_at: new Date('2017-06-13')
    }
  },
  {
    title: 'Поставить цель',
    content: 'Содержание задание может быть большое большое большое содержание задания может быть, дааа',
    replyTypeId: 3,
    targetProgram: 3,
    start_at: new Date('2017-05-27'),
    finish_at: new Date('2017-06-13')
  },
  {
    title: 'Поставить цель',
    content: 'Содержание задание может быть большое большое большое содержание задания может быть, дааа',
    replyTypeId: 3,
    targetProgram: 2,
    start_at: new Date('2017-05-27'),
    finish_at: new Date('2017-06-13')
  },
  {
    title: 'Поставить ПК',
    content: 'Содержание задание может быть большое большое большое содержание задания может быть, дааа',
    replyTypeId: 2,
    targetProgram: 2,
    start_at: new Date('2017-05-27'),
    finish_at: new Date('2017-06-13'),
    replyMeta: {
      title: 'План кинжал №2',
      start_at: new Date('2017-06-03'),
      finish_at: new Date('2017-06-13')
    }
  },
  {
    title: 'Поставить ПК',
    content: 'Содержание задание может быть большое большое большое содержание задания может быть, дааа',
    replyTypeId: 2,
    targetProgram: 3,
    start_at: new Date('2017-05-27'),
    finish_at: new Date('2017-06-13'),
    replyMeta: {
      title: 'План кинжал №3',
      start_at: new Date('2017-06-03'),
      finish_at: new Date('2017-06-13')
    }
  },
  {
    title: 'Тестовое задание 3',
    content: 'Содержание задание может быть большое большое большое содержание задания может быть, дааа',
    replyTypeId: 1,
    targetProgram: 3,
    start_at: new Date('2017-05-27'),
    finish_at: new Date('2017-06-18')
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
  let start = options.start_at ? options.start_at : moment().toISOString()
  let finish = options.finish_at ? options.finish_at : moment().add(7, 'days').toISOString()

  let taskData = {
    title: options.title || 'План-кинжал',
    content: options.content,
    userId: user._id,
    target: { model: 'Users', item: targetId },
    replyTypeId: 4,
    targetProgram: options.programId,
    type: { model: 'KnifePlan', item: plan._id },
    start_at: start,
    finish_at: finish,
    replyMeta: {
      title: 'Отчет: ' + options.title
    }
  }

  // 4.
  let task = await model.create(taskData)
  plan.taskId = task._id
  await plan.save()

  return { task, plan }
}

/** ------------------------ MODEL METHODS ------------------------ */

/** ----------------------- ADD REPLY METHOD ---------------------- */

model.methods.addReply = async function (user, body) {
  let task = this
  // 1. проверяеем был ли ответ от пользователя на это задание
  let isReplied = await task.checkReply(user)
  if (isReplied) throw new Error('already replied by user')

  // 2. подготовка сущностей для создания и записи
  let postInfo = extend(pick(body, [ 'content', 'attachments' ]), { program: task.targetProgram })
  postInfo.title = task.replyMeta.title || task.title

  //
  let additional = {}

  /**
   * Ответы могут быть 4 типов
   * 1. Простой ответ на задание
   * 2. Постановка ПК (действие, цель, цена)
   * 3. Постановка цели (А, Б, Ниша)
   * 4. Отчет по ПК (действие, факт)
   */
  if (task.replyTypeId === 3) {
    // постановка цели
    let entry = await user.addGoal(pick(body, [ 'a', 'b', 'occupation' ]))
    additional.specific = { model: 'Goal', item: entry }
  } else if (task.replyTypeId === 2) {
    // постановка ПК
    let options = extend(pick(task.replyMeta, [ 'title', 'start_at', 'finish_at' ]), { content: body.action, programId: task.targetProgram })
    let result = await mongoose.models.Task.createKnifePlan(user, pick(body, [ 'goal', 'price', 'action' ]), options)
    additional.specific = { model: 'KnifePlan', item: result.plan }
    postInfo.title = result.task.title
  } else if (task.replyTypeId === 4) {
    let [ knifePlan ] = await mongoose.models.KnifePlan.find({ _id: task.type.item }).limit(1).sort({ created: -1 })
    let { report } = await knifePlan.closePlan(body, user, task.targetProgram)
    additional.specific = { model: 'TaskReport', item: report }
  } else {}

  let post = await mongoose.models.Post.addPost(postInfo, { user })

  let taskData = extend(
    pick(postInfo, [ 'title', 'content' ]),
    {
      postId: post._id,
      userId: user._id,
      taskId: task._id,
      replyTypeId: task.replyTypeId
    },
    additional
  )

  let reply = await mongoose.models.TaskReply.makeReply(taskData)

  task.replies.addToSet({ userId: user._id, replyId: reply._id })

  await task.save()

  return { reply, specific: additional.specific ? additional.specific.item : null }
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

model.methods.createReport = async function () {}

module.exports = mongoose.model('Task', model)

/** --------------------- DEFAULTS INITIATION ---------------------- */

// mongoose.models.Task.initDefaults(defaultTasks)
