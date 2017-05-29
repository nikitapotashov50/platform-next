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
  ten: { _id: 1, title: 'Десятка', enabled: true },
  hundred: { _id: 2, title: 'Сотня', enabled: true },
  polk: { _id: 3, title: 'Полк', enabled: true }
}

module.exports = mongoose.model('GameGroupType', model)

mongoose.models.GameGroupType.defaults(defaultTypes)
