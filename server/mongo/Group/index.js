const mongoose = require('mongoose')
const { extend } = require('lodash')
const { is } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  title: { type: String, default: '' },
  leader: { type: ObjectId, ref: 'Users' },
  //
  migration_id: { type: Number },
  total_score: { type: Number },
  money: { type: Number },
  //
  specific: {
    type: { type: String },
    item: { type: ObjectId, refPath: 'specific.type' }
  },
  programs: [ { type: Number, ref: 'Program' } ],
  users: [ { type: ObjectId, ref: 'Users' } ]
}, is))

model.statics.CoachGroup = require('./coach')
model.statics.GameGroup = require('./game/index')

module.exports = mongoose.model('Group', model)
