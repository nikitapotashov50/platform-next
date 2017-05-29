const mongoose = require('mongoose')
const { is } = require('../utils/common')
const { extend } = require('lodash')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  total: { type: Number, required: true },
  score_1: { type: Number, required: true },
  score_2: { type: Number, required: true },
  score_3: { type: Number, required: true },
  //
  body: { type: String, defaukt: '' },
  //
  userId: { type: ObjectId, ref: 'Users' },
  cityId: { type: ObjectId, ref: 'City' }
}, is))

module.exports = mongoose.model('NPS', model)
