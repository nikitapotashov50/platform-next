const messages = require('../factories').messages
const services = require('../services').general

module.exports = router => {
  router.get('/', (ctx, next) => {
    ctx.body = messages.generic.success
  })

  router.get('version', services.getAPIVersionService)
}
