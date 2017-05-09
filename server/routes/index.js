const bridge = require('koa-router-bridge')
const koaRouter = require('koa-router')

const apiRoutes = require('./api')
const clientRoutes = require('./client')

let Router = bridge(koaRouter)
let router = new Router()

let initClientRoutes = async (ctx, next) => {
  await next()
  ctx.respond = false
}

router.bridge('/api', apiRoutes)
router.bridge('*', [ initClientRoutes ], clientRoutes)

module.exports = router