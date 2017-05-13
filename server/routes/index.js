const bridge = require('koa-router-bridge')
const koaRouter = require('koa-router')

const apiRoutes = require('./api')
const clientRoutes = require('./client')

let Router = bridge(koaRouter)
let router = new Router()

const initClientRoutes = async (ctx, next) => {
  if (ctx.params && ctx.params[0]) delete ctx.params[0]
  await next()
  ctx.respond = false
}

const initApiRoutes = async (ctx, next) => {
  if (!ctx.__) ctx.__ = {}
  await next()
}

router.bridge('/api', [ initApiRoutes ], apiRoutes)
router.bridge('*', [ initClientRoutes ], clientRoutes)

module.exports = router
