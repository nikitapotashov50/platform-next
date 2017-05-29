const mongoose = require('mongoose')
const { is } = require('../utils/common')
const { extend } = require('lodash')

const model = new mongoose.Schema(extend({
  title: { type: String, required: true },
  date: { type: Date, default: '' },
  description: { type: String, default: '' },
  //
  programId: { type: Number, ref: 'Program' }
}, is))

module.exports = mongoose.model('ProgramClass', model)
