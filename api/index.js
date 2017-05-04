const combineRouters = require('koa-combine-routers')
const fieldRouter = require('./field')
const generalRouter = require('./general')
const npsRouter = require('./nps')
const authRouter = require('./auth')

const router = combineRouters([
  generalRouter,
  fieldRouter,
  npsRouter,
  authRouter
])

module.exports = router
