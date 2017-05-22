const fs = require('fs')
const path = require('path')
const redis = require('redis')
const Sequelize = require('sequelize')
const cacher = require('sequelize-redis-cache')

const dbConfig = require('../../config').db

/**
 * @description model's factory + register manager
 * @type {module}
 */

let redisClient = redis.createClient(6379, 'localhost')
let sequelize = new Sequelize(dbConfig.uri, {
  // logging: () => {},
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4'
  }
})
let db = []
let views = {}
let cached = {}

fs.readdirSync(__dirname)
  .filter(file => file.match(new RegExp(/^((?!(index.js)).)*$/)))
  .forEach(file => {
    if (file !== 'views') {
      let model = sequelize['import'](path.join(__dirname, file))
      db[model.name] = model
    }
  })

fs.readdirSync(path.join(__dirname, './views'))
  .forEach(file => {
    if (file !== 'mysql_views') {
      var model = sequelize.import(path.join(__dirname, './views/' + file))
      views[model.name] = model
      views[model.name].associate(db)
    }
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
    cached[modelName] = cacher(sequelize, redisClient).model(modelName).ttl(5)
  }
})

module.exports = {
  views,
  models: db,
  cached: cached,
  orm: sequelize
}
