const Router = require('koa-router')
const { messages } = require('../factories')
const services = require('../services')

const router = new Router({ prefix: '/nps' })

router.get('/', (ctx, next) => {
  ctx.body = messages.generic.success
})

router.get('/version', services.general.getAPIVersionService)

module.exports = router