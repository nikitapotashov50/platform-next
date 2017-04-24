const require_all = require('require-all');

/**
 * @description controller's factory
 * @type {module}
 */

module.exports = require_all({
  dirname: __dirname,
  filter: /(.+Controller)\.js$/,
  map:  name=> name.replace('Controller', '')
});