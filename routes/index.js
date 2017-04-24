const require_all = require('require-all'),
  Router = require('koa-router'),
  _ = require('lodash'),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({name: "route"}),
  config = require('../config');

/**
 * @description route's factory
 * @type {module}
 */

module.exports = (app) => {

  app.use(async function(ctx, next) {
    log.info(`${ctx.method} ${ctx.url} - ${new Date()}`);
    try {
      await next();
    } catch (err) {
      log.error(`${ctx.method} ${ctx.url} - ${new Date()}`);
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }

  });

  let routes = require_all({
    dirname: __dirname,
    filter: /(.+Route)\.js$/,
    map:  name=> name.replace('Route', '')
  });

  _.chain(routes)
    .keys()
    .forEach(route_key => {
      let router = new Router({
        prefix: route_key === 'general' ? '/' :
          `/${config.api.version}/${route_key}`
      });

      routes[route_key](router);

      app.use(router.routes())

    })
    .value();

};