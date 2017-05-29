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
  pending: { _id: 1, title: 'Ожидает проверки', enabled: true },
  assigned: { _id: 2, title: 'На проверке', enabled: true },
  approved: { _id: 3, title: 'Выполнено', enabled: true },
  rejected: { _id: 4, title: 'Отклонено', enabled: true }
}

module.exports = mongoose.model('TaskVerificationStatus', model)

mongoose.models.TaskVerificationStatus.defaults(defaultTypes)
