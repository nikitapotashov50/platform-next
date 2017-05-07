const requireAll = require('require-all')

/**
 * @description factory's factory
 * @type {module}
 */

module.exports = {
  messages: requireAll(`${__dirname}/messages`)
}
