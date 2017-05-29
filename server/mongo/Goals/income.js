const mongoose = require('mongoose')
const { extend } = require('lodash')
const { created } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  ammount: { type: Number, required: true },
  is_confirmed: { type: Boolean, default: false },
  //
  created,
  //
  userId: { type: ObjectId, ref: 'Users' }
}, created))

module.exports = mongoose.model('Income', model)
