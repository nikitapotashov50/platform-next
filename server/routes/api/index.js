// const combineRouters = require('koa-combine-routers')
// const fieldRouter = require('./field')
// const generalRouter = require('./general')

module.exports = router => {
  router.get('/', ctx => {
    ctx.body = { user: '123123123' }
  })
  // router.bridge('/field', fieldRouter)
  // router.bridge('*', generalRouter)
}
