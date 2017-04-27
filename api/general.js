const Router = require('koa-router')
const passport = require('koa-passport')
const { messages } = require('../factories')
const services = require('../services')

const router = new Router()

router.get('/', (ctx, next) => {
  ctx.body = messages.generic.success
})

router.post('/login', passport.authenticate('local'), async ctx => {
  console.log('is auth', ctx.isAuthenticated())
  // console.log('is not auth', ctx.isUnauthenticated())
  // console.log('user', ctx.state.user)
  // const login = JSON.parse(ctx.request.body)
  // if (login && login === 'хуй') {
  //   await ctx.login()
  // }
  // ctx.status = 200
})

router.get('/version', services.general.getAPIVersionService)

module.exports = router
