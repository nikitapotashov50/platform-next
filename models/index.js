const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')
const dbConfig = require('../config').db

/**
 * @description model's factory + register manager
 * @type {module}
 */

let sequelize = new Sequelize('bm_platform', 'root', null)
let db = []

fs.readdirSync(__dirname)
  .filter(file => file.match(new RegExp(/^((?!(index.js)).)*$/)))
  .forEach(file => {
    let model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) db[modelName].associate(db)
})

module.exports = {
  models: db,
  orm: sequelize
}
