const combineRouters = require('koa-combine-routers')
const fieldRouter = require('./field')
const generalRouter = require('./general')

const router = combineRouters([
  generalRouter,
  fieldRouter
])

module.exports = router
