const Koa = require('koa')
const next = require('next')
const bunyan = require('bunyan')
const cors = require('koa2-cors')
const mount = require('koa-mount')
const helmet = require('koa-helmet')
const Router = require('koa-router')
const passport = require('koa-passport')
const bodyParser = require('koa-bodyparser')
const koaBunyanLogger = require('koa-bunyan-logger')

const config = require('./config')
const routes = require('./server/routes')

const dev = process.env.NODE_ENV !== 'production'

const client = next({ dev })

client.prepare().then(() => {
  const server = new Koa()
  const log = bunyan.createLogger({ name: 'platform' })

  server.use(koaBunyanLogger(log))
  server.use(helmet())
  server.use(bodyParser())
  server.use(passport.initialize())
  server.use(passport.session())
  server.use(cors())

  server.use(async (ctx, next) => {
    ctx.__next = client
    ctx.res.statusCode = 200
    await next()
  })

  server.use(routes.routes())

  server.listen(config.server.port, () => {
    log.info(`server is running on port: ${config.server.port}`)
  })
})
