const mongoose = require('mongoose')
const { is } = require('../utils/common')
const { extend } = require('lodash')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  total: { type: Number, required: true },
  score: {
    type: [ { type: Number } ],
    validate: [ arrayLimit, '{PATH} exceeds the limit of 3' ]
  },
  //
  content: { type: String, defaukt: '' },
  //
  userId: { type: ObjectId, ref: 'Users' },
  cityId: { type: ObjectId, ref: 'City' },
  //
  programId: { type: Number, ref: 'Program' },
  target: {
    model: { type: String, enum: [ 'ProgramClass', 'Platform', 'CoachGroup', 'Users' ] },
    item: { type: ObjectId, refPath: 'target.model' }
  }
}, is))

function arrayLimit (val) { return val.length <= 3 }

model.statics.addNps = async function (data, user, programId, add = {}) {
  let cityId = await user.getProgramCity(programId)

  data.score = data.score.map(Number)
  let total = data.score.reduce((a, b) => a + b, 0) / data.score.length

  data = extend(data, add, { programId, cityId, total }, { userId: user._id })

  return this.create(data)
}

model.statics.addToClass = async function (data, user, classId, programId) {
  let model = this
  let add = {
    target: {
      model: 'ProgramClass',
      item: classId
    }
  }

  return model.addNps(data, user, programId, add)
}

model.statics.addToProgram = async function (data, user, programId) {
  let model = this
  return model.addNps(data, user, programId)
}

model.statics.addToUser = async function (data, user, userId, programId) {
  let model = this
  let add = {
    target: {
      model: 'Users',
      item: userId
    }
  }

  return model.addNps(data, user, programId, add)
}

model.statics.addToPlatform = async function (data, user, programId) {
  let model = this
  let add = {
    target: { model: 'Platform' }
  }

  return model.addNps(data, user, programId, add)
}

/** ----------------- AGGREGATION ----------------------- */

model.statics.getTotal = async function () {
  let model = this
  let params = {
    'target.model': 'ProgramClass'
  }
  let group = {
    programId: '$programId',
    cityId: '$cityId',
    target: '$target.model',
    item: '$target.item'
  }

  let data = await model.aggregate([
    { $match: params },
    { $project: {
      _id: 1,
      target: 1,
      cityId: 1,
      programId: 1,
      score_1: {
        $switch: {
          branches: [
            { case: { $gte: [ { $arrayElemAt: [ '$score', 0 ] }, 9 ] }, then: 1 },
            { case: { $lte: [ { $arrayElemAt: [ '$score', 0 ] }, 6 ] }, then: -1 }
          ],
          default: 0
        }
      },
      score_2: {
        $switch: {
          branches: [
            { case: { $gte: [ { $arrayElemAt: [ '$score', 1 ] }, 9 ] }, then: 1 },
            { case: { $lte: [ { $arrayElemAt: [ '$score', 1 ] }, 6 ] }, then: -1 }
          ],
          default: 0
        }
      },
      score_3: {
        $switch: {
          branches: [
            { case: { $gte: [ { $arrayElemAt: [ '$score', 2 ] }, 9 ] }, then: 1 },
            { case: { $lte: [ { $arrayElemAt: [ '$score', 2 ] }, 6 ] }, then: -1 }
          ],
          default: 0
        }
      },
      total: {
        $switch: {
          branches: [
            { case: { $gte: [ '$total', 9 ] }, then: 1 },
            { case: { $lte: [ '$total', 6 ] }, then: -1 }
          ],
          default: 0
        }
      }
    }},
    { $group: {
      _id: group,
      count: { $sum: 1 },
      score_1: { $sum: '$score_1' },
      score_2: { $sum: '$score_2' },
      score_3: { $sum: '$score_3' },
      total: { $sum: '$total' }
    }},
    { $project: {
      _id: 1,
      count: 1,
      score_1: { $divide: [ { $multiply: [ '$score_1', 100 ] }, '$count' ] },
      score_2: { $divide: [ { $multiply: [ '$score_2', 100 ] }, '$count' ] },
      score_3: { $divide: [ { $multiply: [ '$score_3', 100 ] }, '$count' ] },
      total: { $divide: [ { $multiply: [ '$total', 100 ] }, '$count' ] }
    }}
  ])

  return data
}

module.exports = mongoose.model('NPS', model)
