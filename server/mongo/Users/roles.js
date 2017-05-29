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
  user: { _id: 1, title: 'Пользователь', enabled: true },
  moderator: { _id: 2, title: 'Модератор', enabled: true },
  admin: { _id: 3, title: 'Администратор', enabled: true }
}

module.exports = mongoose.model('UserRole', model)

mongoose.models.UserRole.defaults(defaultRoles)
