const config = require('../../config')

module.exports = (ctx, next) => {
  ctx.body = {version: config.api.version}
}
