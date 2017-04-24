const requireAll = require('require-all')
const Router = require('koa-router')
const _ = require('lodash')
const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'route'})
const config = require('../config')

/**
 * @description route's factory
 * @type {module}
 */

module.exports = (app) => {
  app.use(async function (ctx, next) {
    log.info(`${ctx.method} ${ctx.url} - ${new Date()}`)
    try {
      await next()
    } catch (err) {
      log.error(`${ctx.method} ${ctx.url} - ${new Date()}`)
      ctx.status = err.status || 500
      ctx.body = err.message
      ctx.app.emit('error', err, ctx)
    }
  })

  let routes = requireAll({
    dirname: __dirname,
    filter: /(.+Route)\.js$/,
    map: name => name.replace('Route', '')
  })

  _.chain(routes)
    .keys()
    .forEach(routeKey => {
      let router = new Router({
        prefix: routeKey === 'general' ? '/'
          : `/${config.api.version}/${routeKey}`
      })

      routes[routeKey](router)

      app.use(router.routes())
    })
    .value()
}
