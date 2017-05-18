const { models } = require('../../models')

// const combineRouters = require('koa-combine-routers')
// const fieldRouter = require('./field')
const generalRouter = require('./general')
const authRoutes = require('./auth')
const postRouter = require('./post')
const feedbackRoutes = require('./feedback')
const meRoutes = require('./me')
const usersRoutes = require('./users')
const migrations = require('./migrations')

const initMeRoutes = async (ctx, next) => {
  if (ctx.session && ctx.session.user) {
    let User = await models.User.findOne({
      where: { id: ctx.session.user.id }
    })
    ctx.__.me = User

    await next()
  } else {
    ctx.status = 403
    ctx.body = {
      status: 403,
      message: 'Access denied'
    }
  }
}

module.exports = router => {
  router.bridge('/auth', authRoutes)
  router.bridge('/users', usersRoutes)
  router.bridge('/feedback', feedbackRoutes)
  router.bridge('/post', postRouter)
  router.bridge('/me', [ initMeRoutes ], meRoutes)
  router.bridge('/migrate', migrations)
  // router.bridge('/field', fieldRouter)
  router.bridge('*', generalRouter)
}
