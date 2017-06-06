const mongoose = require('mongoose')
const { extend } = require('lodash')
const { is } = require('../utils/common')
const defaults = require('../utils/defaults')

const model = new mongoose.Schema(extend({
  _id: { type: Number, unique: true },
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true }
}, is))

model.statics.defaults = defaults

const defaultRoles = {
  student: { _id: 3, title: 'Студент', enabled: true },
  volunteer: { _id: 1, title: 'Волонтер', enabled: true },
  coach: { _id: 2, title: 'Тренерт', enabled: true },
  speaker: { _id: 4, title: 'Спикер', enabled: true }
}

model.statics.rolesByCode = defaultRoles

module.exports = mongoose.model('ProgramRoles', model)

mongoose.models.ProgramRoles.defaults(defaultRoles)
