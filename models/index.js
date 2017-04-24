const Sequelize = require('sequelize'),
  fs = require('fs'),
  path = require('path'),
  db_config = require('../config').db;

/**
 * @description model's factory + register manager
 * @type {module}
 */

let sequelize = new Sequelize(db_config.uri);
let db = [];

fs.readdirSync(__dirname)
  .filter(file => file.match(new RegExp(/^((?!(index.js)).)*$/)))
  .forEach(file => {
    let model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });




Object.keys(db).forEach(modelName=> {
  if (db[modelName].associate) db[modelName].associate(db)

});


module.exports = {
  models: db,
  orm: sequelize
};

