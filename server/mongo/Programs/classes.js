// const moment = require('moment')
const mongoose = require('mongoose')
const { is } = require('../utils/common')
const { extend } = require('lodash')

const model = new mongoose.Schema(extend({
  title: { type: String, required: true },
  date: { type: Date, default: '' },
  description: { type: String, default: '' },
  //
  programId: { type: Number, ref: 'Program' }
}, is))

// let defaultClasses = [
//   { title: 'Занятие 1', date: moment('2017-04-04').toISOString(), programId: 1 },
//   { title: 'Занятие 2', date: moment('2017-04-11').toISOString(), programId: 1 },
//   { title: 'Занятие 3', date: moment('2017-04-18').toISOString(), programId: 1 },
//   { title: 'Занятие 1', date: moment('2017-05-27').toISOString(), programId: 2 },
//   { title: 'Занятие 2', date: moment('2017-06-01').toISOString(), programId: 2 },
//   { title: 'Занятие 3', date: moment('2017-06-04').toISOString(), programId: 2 }
// ]

// model.statics.initDefaults = async function (defaults) {
//   let model = this
//   await model.remove()
//   await Promise.all(defaults.map(el => {
//     return model.create(el)
//   }))
//   console.log('done')
// }

model.methods.addNPS = async function (data, user) {
  let nps = await mongoose.models.NPS.addToClass(data, user, this._id, this.programId)
  return nps
}

module.exports = mongoose.model('ProgramClass', model)

// mongoose.models.ProgramClass.initDefaults(defaultClasses)
