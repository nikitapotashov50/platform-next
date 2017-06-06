const mongoose = require('mongoose')
const { is } = require('../utils/common')
const { extend } = require('lodash')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  name: { type: String, required: true, unique: true },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  migration_id: { type: Number },
  regionId: { type: ObjectId, ref: 'Region' }
}, is))

model.statics.Region = require('./region')

module.exports = mongoose.model('City', model)
