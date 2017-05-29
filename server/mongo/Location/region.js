const mongoose = require('mongoose')
const { is } = require('../utils/common')
const { extend } = require('lodash')

const model = new mongoose.Schema(extend({
  name: { type: String, required: true, unique: true },
  iso3166: { type: String, required: true },
  region_geometry_feature: { type: String },
  migration_id: { type: Number }
}, is))

model.virtual('cities', {
  ref: 'City',
  localField: '_id',
  foreignField: 'regionId'
})

module.exports = mongoose.model('Region', model)
