const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/bm-platform')

exports.Users = require('./Goals')
exports.Users = require('./Users')
//
exports.Posts = require('./Posts')
exports.Posts = require('./Programs')
exports.Posts = require('./Tasks')
exports.Posts = require('./Group')
//
exports.Posts = require('./Location')
//
exports.Posts = require('./Likes')
exports.Posts = require('./Comments')
exports.Posts = require('./Attachments')
