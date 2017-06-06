const requireAll = require('require-all')

module.exports = requireAll({
  dirname: __dirname,
  filter: /(.+Controller)\.js$/,
  map: name => name.replace('Controller', '')
})
