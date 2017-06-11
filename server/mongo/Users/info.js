const mongoose = require('mongoose')
const { extend, pick } = require('lodash')
const { created } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

let genders = {
  values: [ 'male', 'feemale', null ]
}

let statuses = {
  values: [ 'single', 'couple', 'married', null ]
}

const model = new mongoose.Schema(extend({
  phone: { type: String, default: '' },
  vk: { type: String, default: '' },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  website: { type: String, default: '' },
  //
  about: { type: String, default: '' },
  hobbies: { type: String, default: '' },
  //
  birthday: { type: Date },
  gender: { type: String, enum: genders, default: null },
  social_status: { type: String, enum: statuses, default: null },
  //
  userId: { type: ObjectId, ref: 'Users', required: true, unique: true }
}, created))

model.index({ 'userId': 1 }, { unique: true })

model.statics.getOrCreate = async function (userId) {
  let model = this
  let meta = await model.findOne({ userId })
  if (!meta) meta = await model.create({ userId })

  return meta
}

model.methods.update = async function (data) {
  let _self = this
  _self = extend(_self, pick(data, [ 'phone', 'vk', 'facebook', 'instagram', 'website', 'about', 'hobbies', 'birthday', 'gender', 'social_status' ]))
  await _self.save()
  return _self
}

module.exports = mongoose.model('UsersInfo', model)
