const mongoose = require('mongoose')
const { extend, pick } = require('lodash')
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

  let income = await user.addIncome(data.fact, programId)
  return model.create({ income, action: data.action, fact: data.fact })
}

/** ----------------- METHODS ----------------- */

model.methods.editReport = async function (data) {
  let report = this
  report = extend(report, pick(data, [ 'action', 'fact' ]))

  if (data.fact) {
    let [ income ] = await mongoose.models.Income.find({ _id: report.income }).limit(1)
    if (income) {
      income.amount = data.fact
      await income.save()
    }
  }

  return report.save()
}

module.exports = mongoose.model('TaskReport', model)
