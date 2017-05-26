const mongoose = require('mongoose')
const { is } = require('../utils/common')

const model = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: '' },
  description: { type: String, default: '' },
  //
  program: { type: Number, ref: 'Programs' },
  //
  is
})

module.exports = mongoose.model('ProgramClass', model)
