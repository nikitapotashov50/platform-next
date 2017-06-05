const mongoose = require('mongoose')
const { extend } = require('lodash')
const { is } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  fact: { type: Number },
  action: { type: String, default: '' },
  income: { type: ObjectId, ref: 'Income' }
}, is))

/** ----------------- STATICS ----------------- */

model.statics.makeReport = async function (data, user, programId) {
  if (!data.fact || !data.action) throw new Error('no action or fact specified')

  let model = this
  data.fact = Number(data.fact)
  console.log(data)
  let income = await user.addIncome(data.fact, programId)
  return model.create({ income, action: data.action, fact: data.fact })
}

/** ----------------- METHODS ----------------- */

module.exports = mongoose.model('TaskReport', model)
