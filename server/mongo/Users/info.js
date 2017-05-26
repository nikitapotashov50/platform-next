const mongoose = require('mongoose')

const model = new mongoose.Schema({
  phone: { type: String, default: '' }
})

module.exports = mongoose.model('UsersInfo', model)
