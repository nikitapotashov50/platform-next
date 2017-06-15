const mongoose = require('mongoose')
const { is } = require('../utils/common')
const { extend, pick } = require('lodash')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  name: { type: String, required: true, unique: true },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  molodost_id: { type: Number },
  migration_id: { type: Number },
  regionId: { type: ObjectId, ref: 'Region' }
}, is))

model.statics.Region = require('./region')

const getAdditionalData = data => {
  let res = {}
  if (data.city_id) res.molodost_id = data.city_id
  return res
}

model.statics.getOrCreate = async function (name, data) {
  let model = this
  let [ city ] = await model.find({ name }).limit(1)
  if (!city) city = await model.create(extend({ name }, getAdditionalData(data)))
  else if (!city.molodost_id || (data.city_id && city.molodost_id !== data.city_id)) {
    city.molodost_id = data.city_id
    await city.save()
  }

  return city
}

model.statics.getNullCity = function () {
  return this.findOne({ name: 'Не указан' })
}

module.exports = mongoose.model('City', model)
