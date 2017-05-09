// const combineRouters = require('koa-combine-routers')
// const fieldRouter = require('./field')
// const generalRouter = require('./general')
const authRoutes = require('./auth')
const postRouter = require('./post')

module.exports = router => {
  router.bridge('/auth', authRoutes)
  router.bridge('/post', postRouter)
  // router.bridge('/field', fieldRouter)
  // router.bridge('*', generalRouter)

  router.post('/restore', async ctx => {
    let { user } = ctx.session
    console.log(ctx.session)

    ctx.body = {
      user
    }
  })
}