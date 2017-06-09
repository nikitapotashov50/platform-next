const mongoose = require('mongoose')
const { extend, pick } = require('lodash')
const { is } = require('../../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  goal: { type: Number, required: true },
  price: { type: String, default: '' },
  action: { type: String, required: true },
  //
  taskId: { type: ObjectId, ref: 'Task', index: true },
  userId: { type: ObjectId, ref: 'Users', index: true },
  goalId: { type: ObjectId, ref: 'Goal', index: true },
  reportId: { type: ObjectId, ref: 'TaskReport', index: true },
  //
  success: { type: Boolean, default: null },
  confirmed: { type: Boolean, default: false }
}, is))

/**
 *
 * TODO: add check for goal's end date
 */
model.statics.createPlan = async function (userId, data) {
  let model = this

  if (!userId) throw new Error('No user')

  data = extend(pick(data, [ 'goal', 'price', 'action' ]), { userId })

  let { goal } = await mongoose.models.Goal.getActiveForUser(userId)

  if (!goal) throw new Error('No goal found')

  data.goalId = goal._id

  return model.create(data)
}

model.methods.closePlan = async function (data, user, programId) {
  let plan = this

  let report = await mongoose.models.TaskReport.makeReport(pick(data, [ 'action', 'fact' ]), user, programId)
  plan.reportId = report._id
  plan.success = (data.fact >= plan.goal)
  await plan.save()

  return { report, plan }
}

model.methods.confirmPlan = async function (status) {
  let plan = this

  let [ report ] = await mongoose.models.TaskReport.find({ _id: plan.reportId }).limit(1).populate('income')
  if (!report) throw new Error('no report found')
  if (!report.income) throw new Error('no income found')

  await report.income.confirm(status)

  plan.confirmed = status
  return plan.save()
}

module.exports = mongoose.model('KnifePlan', model)
