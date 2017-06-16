const mongoose = require('mongoose')
const { extend, pick } = require('lodash')
const { is } = require('../../../utils/common')

const model = new mongoose.Schema(extend({
  occupation: { type: String, default: '' },
  x10: { type: Number, required: true },
  dream: { type: String, default: '' },
  //
  a: { type: Number, required: true },
  b: { type: Number, required: true },
  pq: { type: String, default: '' },
  //
  pie: { type: String, default: '' },
  need: { type: String, default: '' }
}, is))

model.statics.make = function (data = {}) {
  let model = this
  return model.create(pick(data, [ 'occupation', 'x10', 'dream', 'a', 'b', 'pq', 'pie', 'need' ]))
}

module.exports = mongoose.model('GretingReply', model)