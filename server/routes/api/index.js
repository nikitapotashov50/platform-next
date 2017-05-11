// const combineRouters = require('koa-combine-routers')
// const fieldRouter = require('./field')
const generalRouter = require('./general')
const authRoutes = require('./auth')
const postRouter = require('./post')
const feedbackRoutes = require('./feedback')

module.exports = router => {
  router.bridge('/auth', authRoutes)
  router.bridge('/feedback', feedbackRoutes)
  router.bridge('/post', postRouter)

  // router.bridge('/field', fieldRouter)
  // router.bridge('*', generalRouter)

  router.bridge('*', generalRouter)
}
