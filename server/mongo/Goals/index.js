const mongoose = require('mongoose')
const { extend, pick } = require('lodash')
const { created, startFinish } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  a: { type: Number, required: true },
  b: { type: Number, required: true },
  occupation: { type: String, default: '' },
  category: { type: String, default: '' },
  //
  closed: { type: Boolean, default: false },
  //
  userId: { type: ObjectId, ref: 'Users', required: true },
  incomes: [{ type: ObjectId, ref: 'Incomes' }]
}, created, startFinish))

model.statics.Income = require('./income')

/** ------------------- MODEL STATICS ------------------- */

/**
 * ADD GOAL TO USER
 * adds goal to user
 */
model.statics.addToUser = async function (userId, data, add) {
  // first find previuos goal for this user
  let previousGoal = await mongoose.models.Goal.findOne({
    userId,
    closed: false,
    enabled: true
  })
  // then close it if there is one
  if (previousGoal) await previousGoal.close()

  data = pick(extend(data, add), [ 'a', 'b', 'occupation', 'category', 'created', 'closed' ])
  let goal = await this.create(extend(data, { userId }))
  return goal
}

model.statics.getActiveForUser = async function (userId, options = {}) {
  let model = this
  let [ goal ] = await model.find({ userId, closed: false, enabled: true }).limit(1).sort({ created: -1 })

  let progress = 0
  if (goal) progress = await mongoose.models.Income.calculate({ _id: { $in: goal.incomes || [] } })

  return goal ? { goal, progress } : { goal: null, progress: null }
}

/** ------------------- MODEL METHODS ------------------- */

model.methods.update = async function (data) {
  let goal = this
  goal = extend(goal, pick(data, [ 'a', 'b', 'occupation', 'closed', 'start_at', 'finish_at' ]))
  await goal.save()
  return goal
}

model.methods.close = async function () {
  let goal = this
  goal.closed = true
  return goal.save()
}

/**
 * ADD INCOME
 * adds income to user's goal
 */
model.methods.addIncome = async function (amount, programId) {
  let goal = this
  let income = await mongoose.models.Income.create({
    amount,
    programId,
    userId: goal.userId
  })

  goal.incomes.addToSet(income)
  await goal.save()

  return income
}

module.exports = mongoose.model('Goal', model)
