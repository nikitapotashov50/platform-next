const require_all = require('require-all');

/**
 * @description factory's factory
 * @type {module}
 */

module.exports = {
  messages: require_all(`${__dirname}/messages`)
};