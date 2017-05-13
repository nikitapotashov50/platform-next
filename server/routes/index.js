const bridge = require('koa-router-bridge')
const koaRouter = require('koa-router')

const { models } = require('../models')
const { isUserAuthOnBM } = require('../controllers/authController')

const apiRoutes = require('./api')
const clientRoutes = require('./client')

let Router = bridge(koaRouter)
let router = new Router()

let processing = false

const initSession = async (user, hash, agent) => {
  let dbUser = null
  if (user && hash) {
    let isAuth = await isUserAuthOnBM(unescape(user), unescape(hash), agent)

    if (!isAuth) return null

    dbUser = models.User.findOne({
      where: { email: unescape(user) }
    })
  }

  return dbUser
}

const initRoutes = async (ctx, next) => {
  if (!ctx.session.user && !processing) {
    processing = true
    let user = await initSession(ctx.cookies.get('molodost_user'), ctx.cookies.get('molodost_hash'), ctx.request.header['user-agent'])
    processing = false
    ctx.session.user = user
  }
  await next()
}

const initClientRoutes = async (ctx, next) => {
  if (ctx.params && ctx.params[0]) delete ctx.params[0]
  await next()
  ctx.respond = false
}

const initApiRoutes = async (ctx, next) => {
  if (!ctx.__) ctx.__ = {}
  await next()
}

router.bridge('/api', [ initApiRoutes, initRoutes ], apiRoutes)
router.bridge('*', [ initClientRoutes, initRoutes ], clientRoutes)

module.exports = router
