const mongoose = require('mongoose')
const { extend, pick } = require('lodash')
const { is } = require('../../../utils/common')

const model = new mongoose.Schema(extend({
  occupation: { type: String, default: '' },
  x10: { type: Number, required: true },
  dream: { type: String, default: '' },
  dream_artifact: { type: String, default: '' },
  //
  a: { type: Number, required: true },
  b: { type: Number, required: true },
  pq: { type: String, default: '' },
  //
  week_money: { type: Number, requried: true },
  week_action: { type: String, default: '' }
}, is))

model.statics.make = function (data = {}) {
  let model = this
  return model.create(pick(data, [ 'occupation', 'x10', 'dream', 'dream_artifact', 'a', 'b', 'pq', 'week_money', 'week_action' ]))
}

module.exports = mongoose.model('GretingReply', model)
