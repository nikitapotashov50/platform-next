const moment = require('moment')
const mongoose = require('mongoose')
const { is } = require('../utils/common')
const defaults = require('../utils/defaults')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema({
  _id: { type: Number, unique: true },
  alias: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  //
  is_enabled: { type: Boolean, default: true },
  start_at: { type: Date, default: Date.now, required: true },
  finish_at: { type: Date, default: Date.now, required: true },
  //
  classes: [ { type: ObjectId, ref: 'ProgramClass' } ],
  //
  is
})

// const defaultPrograms = {
//   'ceh-23': { _id: 1, title: 'ЦЕХ 23', is_enabled: true, start_at: moment('2015-01-01').format('YYYY-DD-MM'), finish_at: moment('2115-01-01').format('YYYY-DD-MM') },
//   'mzs-17': { _id: 2, title: 'МЗС 17', is_enabled: true, start_at: moment('2015-01-01').format('YYYY-DD-MM'), finish_at: moment('2115-01-01').format('YYYY-DD-MM') },
//   default: { _id: 3, title: 'Общая лента', is_enabled: true, start_at: moment('2015-01-01').format('YYYY-DD-MM'), finish_at: moment('2115-01-01').format('YYYY-DD-MM') }
// }

model.statics.defaults = defaults

model.statics.ProgramClass = require('./classes')

module.exports = mongoose.model('Program', model)

// mongoose.models.Program.defaults(defaultPrograms, 'alias')
