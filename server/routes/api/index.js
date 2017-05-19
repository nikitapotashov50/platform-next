const { models } = require('../../models')

// const combineRouters = require('koa-combine-routers')
// const fieldRouter = require('./field')
const generalRouter = require('./general')
const authRoutes = require('./auth')
const postRouter = require('./post')
const feedbackRoutes = require('./feedback')
const meRoutes = require('./me')
const usersRoutes = require('./users')
<<<<<<< HEAD
<<<<<<< HEAD
const attachmentRoutes = require('./attachment')
=======
const migrations = require('./migrations')
>>>>>>> migrations
=======
const migrations = require('./migrations')
>>>>>>> 760ce990f2850f4cbd0a494e1f5ac46bc7126441

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
<<<<<<< HEAD
<<<<<<< HEAD
  router.bridge('/attachment', attachmentRoutes)

=======
  router.bridge('/migrate', migrations)
>>>>>>> migrations
=======
  router.bridge('/migrate', migrations)
>>>>>>> 760ce990f2850f4cbd0a494e1f5ac46bc7126441
  // router.bridge('/field', fieldRouter)
  router.bridge('*', generalRouter)
}
