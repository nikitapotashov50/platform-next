const { Schema } = require('mongoose')

const is = new Schema(
  {
    enabled: { type: Boolean, default: true, required: true },
    created: { type: Date, default: Date.now, required: true },
    updated: { type: Date, default: Date.now, required: true }
  },
  {
    _id: false
  }
)

module.exports = { is }
