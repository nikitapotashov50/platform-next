const requireAll = require('require-all')

module.exports = requireAll({
  dirname: __dirname,
  filter: /(.+Service)\.js$/,
  recursive: true
})
