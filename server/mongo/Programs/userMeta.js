const mongoose = require('mongoose')
const { extend, pick } = require('lodash')
const { is } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  price: { type: Number, default: null },
  activated_at: { type: Date, default: null },
  is_activated: { type: Boolean, default: false },
  //
  cityId: { type: ObjectId, ref: 'City' },
  userId: { type: ObjectId, ref: 'Users', required: true },
  programId: { type: Number, ref: 'Program', required: true }
}, is))

model.statics.makeMeta = async function (programId, userId, data) {
  let model = this
  data = pick(data, [ 'activated_at', 'is_activated', 'cityId', 'price' ])

  let meta = await model.create(extend(data, { programId, userId }))
  return meta
}

module.exports = mongoose.model('ProgramUserMeta', model)
