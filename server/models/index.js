const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')
const dbConfig = require('../../config').db

/**
 * @description model's factory + register manager
 * @type {module}
 */

let sequelize = new Sequelize(dbConfig.uri, {
  // logging: () => {},
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4'
  }
})
let db = []
let views = {}

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
  if (db[modelName].associate) db[modelName].associate(db)
})

module.exports = {
  views,
  models: db,
  orm: sequelize
}
