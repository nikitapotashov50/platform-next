const config = require('../../../config')

module.exports = ctx => {
  ctx.body = {
    version: config.api.version
  }
}
