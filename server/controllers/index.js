const requireAll = require('require-all')

/**
 * @description controller's factory
 * @type {module}
 */

module.exports = requireAll({
  dirname: __dirname,
  filter: /(.+Controller)\.js$/,
  map: name => name.replace('Controller', '')
})
