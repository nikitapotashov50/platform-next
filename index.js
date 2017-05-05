const Koa = require('koa')
const next = require('next')
const bunyan = require('bunyan')
const cors = require('koa2-cors')
// const CSRF = require('koa-csrf')
const helmet = require('koa-helmet')
const session = require('koa-session2')
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
  server.use(session({ key: '4911b7ef185e44d38d5ba8767034ef67' }))
  server.use(bodyParser())
  server.use(passport.initialize())
  server.use(passport.session())
  server.use(cors())

  server.use(async (ctx, next) => {
    ctx.__next = client
    ctx.res.statusCode = 200
    ctx.req.session = ctx.session
    await next()
  })

  server.use(routes.routes())

  server.listen(config.server.port, () => {
    log.info(`server is running on port: ${config.server.port}`)
  })
})
