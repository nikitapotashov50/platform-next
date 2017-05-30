require('mongoose-keyobj')
const mongoose = require('mongoose')
const cachegoose = require('cachegoose')

mongoose.connect('mongodb://localhost/bm-platform')

cachegoose(mongoose, {
  engine: 'redis',
  port: 6379,
  host: 'localhost'
})

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
