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

model.statics.populateFieldsByType = {
  default: [],
  task: [],
  goal: [ 'a', 'b', 'occupation', '_id' ],
  report: []
}

const defaultTypes = {
  default: { _id: 1, title: 'Выполнить задание', enabled: true },
  knife: { _id: 2, title: 'Поставить план-кинжал', enabled: true },
  goal: { _id: 3, title: 'Поставить цель', enabled: true },
  report: { _id: 4, title: 'Написать отчет', enabled: true }
}

module.exports = mongoose.model('TaskReplyType', model)

mongoose.models.TaskReplyType.defaults(defaultTypes)
