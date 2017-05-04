const Koa = require('koa')
const helmet = require('koa-helmet')
const Router = require('koa-router')
const mount = require('koa-mount')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session2')
const cors = require('koa2-cors')
const koaBunyanLogger = require('koa-bunyan-logger')
const next = require('next')
const bunyan = require('bunyan')
const config = require('./config')
const apiRoutes = require('./api')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()
  const log = bunyan.createLogger({
    name: 'platform'
  })

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(koaBunyanLogger(log))
  server.use(helmet())
  server.use(bodyParser())
  app.use(session({
    key: config.api.session_key,
    secure: true,
    httpOnly: true,
    signed: true
  }))
  server.use(cors())
  server.use(mount('/api', apiRoutes))
  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })
  server.use(router.routes())

  server.listen(config.server.port, () => {
    log.info(`server is running on port: ${config.server.port}`)
  })
})
