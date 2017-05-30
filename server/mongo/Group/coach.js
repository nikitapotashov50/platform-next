const mongoose = require('mongoose')
const { extend } = require('lodash')
const { created } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  groupId: { type: ObjectId, ref: 'Group', required: true },
  expelled: [ { type: ObjectId, ref: 'Users' } ],
  refunded: [ { type: ObjectId, ref: 'Users' } ]
}, created))

module.exports = mongoose.model('CoachGroup', model)
