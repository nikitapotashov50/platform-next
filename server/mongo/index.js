const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/bm-platform')

exports.Users = require('./Users')
exports.Posts = require('./Posts')
exports.Posts = require('./Programs')
