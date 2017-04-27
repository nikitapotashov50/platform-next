const Koa = require('koa')
const config = require('./config')
const apiRoutes = require('./api')
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport')
const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'platform' })
const cors = require('koa2-cors')
const next = require('next')
const Router = require('koa-router')
const mount = require('koa-mount')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(bodyParser())
  server.use(passport.initialize())
  server.use(passport.session())
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
