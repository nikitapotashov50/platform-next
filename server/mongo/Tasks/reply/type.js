const mongoose = require('mongoose')
const { extend } = require('lodash')
const { is } = require('../../utils/common')
const defaults = require('../../utils/defaults')

const model = new mongoose.Schema(extend({
  _id: { type: Number, unique: true },
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true }
}, is))

model.statics.defaults = defaults

const defaultTypes = {
  default: { _id: 1, title: 'Выполнить задание', enabled: true },
  task: { _id: 2, title: 'Поставить задания', enabled: true },
  goal: { _id: 3, title: 'Поставить цель', enabled: true },
  report: { _id: 4, title: 'Написать отчет', enabled: true }
}

module.exports = mongoose.model('TaskReplyTypes', model)

mongoose.models.TaskReplyTypes.defaults(defaultTypes)
