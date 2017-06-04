const mongoose = require('mongoose')
const { extend, pick } = require('lodash')
const { is } = require('../../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  goal: { type: Number, required: true },
  price: { type: String, default: '' },
  action: { type: String, required: true },
  //
  userId: { type: ObjectId, ref: 'Users', index: true },
  goalId: { type: ObjectId, ref: 'Goal', index: true },
  reportId: { type: ObjectId, ref: 'TaskReport', index: true }
}, is))

/**
 *
 * TODO: add check for goal's end date
 */
model.statics.createPlan = async function (userId, data) {
  let model = this

  if (!userId) throw new Error('No user')

  data = extend(pick(data, [ 'goal', 'price', 'action' ]), { userId })

  let goal = await mongoose.models.Goal.getActiveForUser(userId)

  if (!goal) throw new Error('No goal found')

  data.goalId = goal._id

  return model.create(data)
}

module.exports = mongoose.model('KnifePlan', model)
