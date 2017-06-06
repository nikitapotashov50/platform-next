const mongoose = require('mongoose')
const defaults = require('../utils/defaults')

const model = new mongoose.Schema({
  _id: { type: Number, unique: true },
  code: { type: String, unique: true }
})

var defaultTypes = {
  user: { _id: 0 },
  content: { _id: 1 }
}

model.statics.defaults = defaults

module.exports = mongoose.model('PostTypes', model)

mongoose.models.PostTypes.defaults(defaultTypes)
