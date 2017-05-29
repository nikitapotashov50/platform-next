const mongoose = require('mongoose')
const { extend } = require('lodash')
const { created } = require('../../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  groupId: { type: ObjectId, ref: 'Group', required: true },
  type: { type: Number, ref: 'GameGroupType' },
  parentId: { type: ObjectId, ref: 'GameGroup' }
}, created))

model.virtual('childrens', {
  ref: 'GameGroup',
  localField: '_id',
  foreignField: 'parentId'
})

model.statics.GameGroupType = require('./types')

module.exports = mongoose.model('GameGroup', model)
