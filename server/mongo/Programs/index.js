const moment = require('moment')
const { extend } = require('lodash')
const mongoose = require('mongoose')
const { is, startFinish } = require('../utils/common')
const defaults = require('../utils/defaults')

const model = new mongoose.Schema(extend({
  _id: { type: Number, unique: true },
  alias: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' }
}, is, startFinish))

model.virtual('classes', {
  ref: 'ProgramClass',
  localField: '_id',
  foreignField: 'programId'
})

model.virtual('users', {
  ref: 'Users',
  localField: '_id',
  foreignField: 'programs.programId'
})

const defaultPrograms = {
  'ceh-23': { _id: 1, title: 'ЦЕХ 23', is_enabled: true, start_at: moment('2015-01-01').format('YYYY-DD-MM'), finish_at: moment('2115-01-01').format('YYYY-DD-MM') },
  'mzs-17': { _id: 2, title: 'МЗС 17', is_enabled: true, start_at: moment('2015-01-01').format('YYYY-DD-MM'), finish_at: moment('2115-01-01').format('YYYY-DD-MM') },
  default: { _id: 3, title: 'Общая лента', is_enabled: true, start_at: moment('2015-01-01').format('YYYY-DD-MM'), finish_at: moment('2115-01-01').format('YYYY-DD-MM') }
}

model.statics.defaults = defaults

model.statics.ProgramClass = require('./classes')
model.statics.ProgramRoles = require('./roles')
model.statics.ProgramUserMeta = require('./userMeta')

module.exports = mongoose.model('Program', model)

mongoose.models.Program.defaults(defaultPrograms, 'alias')
