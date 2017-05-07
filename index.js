const Koa = require('koa')
const next = require('next')
const bunyan = require('bunyan')
const cors = require('koa2-cors')
// const CSRF = require('koa-csrf')
const helmet = require('koa-helmet')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const koaBunyanLogger = require('koa-bunyan-logger')
const config = require('./config')
const routes = require('./server/routes')

const dev = process.env.NODE_ENV !== 'production'
const client = next({ dev })

client.prepare().then(() => {
  const server = new Koa()
  const log = bunyan.createLogger({ name: 'platform' })

  server.keys = [config.api.session_key]

  server.use(koaBunyanLogger(log))
  server.use(helmet())
  server.use(bodyParser())
  server.use(session({
    key: 'sess',
    // secure: true, // Need HTTPS on development
    httpOnly: true,
    signed: true
  }, server))
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
