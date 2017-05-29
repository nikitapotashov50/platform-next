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

model.statics.addToUser = async function (userId, data, add) {
  data = pick(extend(data, add), [ 'a', 'b', 'occupation', 'category', 'created', 'closed' ])
  let goal = await this.create(extend(data, { userId }))
  return goal
}

model.methods.update = async function (data) {
  let goal = this
  goal = extend(goal, pick(data, [ 'a', 'b', 'occupation', 'closed', 'start_at', 'finish_at' ]))
  await goal.save()
  return goal
}

module.exports = mongoose.model('Goal', model)
