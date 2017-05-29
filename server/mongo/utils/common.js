const { extend } = require('lodash')

const created = {
  created: { type: Date, default: Date.now, required: true },
  updated: { type: Date, default: Date.now, required: true }
}

const is = extend(created, {
  enabled: { type: Boolean, default: true, required: true }
})

const startFinish = {
  start_at: { type: Date, default: null },
  finish_at: { type: Date, default: null }
}

module.exports = { is, created, startFinish }
