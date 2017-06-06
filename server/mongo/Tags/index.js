const mongoose = require('mongoose')
const { extend } = require('lodash')
const { is } = require('../utils/common')

const model = new mongoose.Schema(extend({
  title: { type: String, default: '', required: true }
}, is))

module.exports = mongoose.model('Tag', model)
