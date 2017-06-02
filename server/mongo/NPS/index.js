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

module.exports = mongoose.model('NPS', model)
