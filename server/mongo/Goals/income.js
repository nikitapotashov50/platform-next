const mongoose = require('mongoose')
const { extend } = require('lodash')
const { created } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  amount: { type: Number, required: true },
  confirmed: { type: Boolean, default: false },
  //
  userId: { type: ObjectId, ref: 'Users', required: true },
  programId: { type: Number, ref: 'Program' }
}, created))

model.methods.confirm = async function (status) {
  this.confirmed = status
  return this.save()
}

module.exports = mongoose.model('Income', model)
