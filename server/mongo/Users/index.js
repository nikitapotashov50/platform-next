const mongoose = require('mongoose')
const { is } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  last_name: { type: String, default: '' },
  first_name: { type: String, default: '' },
  //
  is,
  //
  userInfo: { type: ObjectId, ref: 'UsersInfo' },
  programs: { type: Number, ref: 'Programs' }
})

model.index({ 'name': 1, 'email': 1 }, { unique: true })

model.statics.UsersInfo = require('./info')

module.exports = mongoose.model('Users', model)
