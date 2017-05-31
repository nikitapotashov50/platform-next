const mongoose = require('mongoose')
const { extend } = require('lodash')
const { is } = require('../utils/common')

const model = new mongoose.Schema(extend({
  fact: { type: Number, required: true },
  action: { type: String, default: '' }
}, is))

module.exports = mongoose.model('TaskReport', model)
