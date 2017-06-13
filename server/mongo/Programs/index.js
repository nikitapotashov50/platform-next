const moment = require('moment')
const { extend } = require('lodash')
const mongoose = require('mongoose')
const { is, startFinish } = require('../utils/common')
const defaults = require('../utils/defaults')

const model = new mongoose.Schema(extend({
  _id: { type: Number, unique: true },
  alias: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  noClasses: { type: Boolean, default: false }
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

/** ------------------------ STATICS ------------------------ */

model.statics.defaults = defaults

model.statics.ProgramClass = require('./classes')
model.statics.ProgramRoles = require('./roles')
model.statics.ProgramUserMeta = require('./userMeta')

/** ------------------------ METHODS ------------------------ */

model.methods.getLastClass = async function () {
  let program = this
  if (program.noClasses) return null

  let [ lastClass ] = await mongoose.models.ProgramClass
    .find({
      programId: program._id,
      date: { $lte: moment().toISOString() }
    })
    .sort({ date: -1 })
    .limit(1)
    // .lean()

  return lastClass
}

model.methods.addNPS = async function (data, user) {
  let program = this
  return mongoose.models.NPS.addToProgram(data, user, program._id)
}

module.exports = mongoose.model('Program', model)

/** ----------------------- DEFAULTS ------------------------ */

const defaultPrograms = {
  'ceh-23': { _id: 1, title: 'ЦЕХ 23', is_enabled: true, start_at: moment('2017-01-01').format('YYYY-DD-MM'), finish_at: moment('2017-04-04').format('YYYY-DD-MM') },
  'mzs-17': { _id: 2, title: 'МЗС 17', is_enabled: true, start_at: moment('2017-01-01').format('YYYY-DD-MM'), finish_at: moment('2017-04-04').format('YYYY-DD-MM') },
  default: { noClasses: true, _id: 3, title: 'Общая лента', is_enabled: true, start_at: moment('2015-01-01').format('YYYY-DD-MM'), finish_at: moment('2115-01-01').format('YYYY-DD-MM') },
  'ceh-24': { _id: 4, title: 'ЦЕХ 24', is_enabled: true, start_at: moment('2017-06-08').toISOString(), finish_at: moment('2017-08-12').toISOString() },
  'mzs-18': { _id: 5, title: 'МЗС 18', is_enabled: true, start_at: moment('2017-06-27').toISOString(), finish_at: moment('2017-08-22').toISOString() }
}

mongoose.models.Program.defaults(defaultPrograms, 'alias')
