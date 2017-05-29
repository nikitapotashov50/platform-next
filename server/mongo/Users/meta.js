const mongoose = require('mongoose')
const { extend, pick } = require('lodash')
const { created } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  timezone: { type: Number },
  remote_ip: { type: String, default: null },
  uid: { type: String, default: null },
  migration_id: { type: Number },
  molodost_id: { type: Number },
  //
  userId: { type: ObjectId, ref: 'Users', required: true, unique: true }
}, created))

model.index({ 'userId': 1 }, { unique: true })

model.statics.getOrCreate = async function (userId, data = {}) {
  let model = this
  let meta = await model.findOne({ userId })
  if (!meta) meta = await model.create({ userId })

  meta = extend(meta, data)
  meta = await meta.save()

  return meta
}

model.methods.update = async function (data) {
  let _self = this
  _self = extend(_self, pick(data, [ 'timezone', 'remote_ip', 'uid', 'migration_id', 'molodost_id' ]))
  await _self.save()
  return _self
}

module.exports = mongoose.model('UsersMeta', model)
