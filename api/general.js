const Router = require('koa-router')
const { messages } = require('../factories')
const services = require('../services')

const router = new Router()

router.get('/', (ctx, next) => {
  ctx.body = messages.generic.success
})

router.post('/login', async ctx => {
  ctx.body = {
    ok: true
  }
})

router.get('/version', services.general.getAPIVersionService)

module.exports = router
