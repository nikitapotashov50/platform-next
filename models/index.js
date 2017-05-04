const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')
const dbConfig = require('../config').db

const sequelize = new Sequelize(dbConfig.uri)
const db = []

fs.readdirSync(__dirname)
  .filter(file => file.match(new RegExp(/^((?!(index.js)).)*$/)))
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) db[modelName].associate(db)
})

module.exports = {
  models: db,
  orm: sequelize
}
