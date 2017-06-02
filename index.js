require('dotenv').config()

const Koa = require('koa')
const next = require('next')
const bunyan = require('bunyan')
const cors = require('koa2-cors')
// const CSRF = require('koa-csrf')
// const cache = require('koa-redis-cache')
const helmet = require('koa-helmet')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const koaBunyanLogger = require('koa-bunyan-logger')
const ms = require('ms')
const config = require('./config')
const routes = require('./server/routes')
const LRUCache = require('lru-cache')

const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60 // 1hour
})

const dev = process.env.NODE_ENV !== 'production'
const client = next({ dev })

require('./server/mongo')

client.prepare().then(() => {
  const server = new Koa()
  const log = bunyan.createLogger({ name: 'platform' })

  server.keys = [config.api.session_key]

  server.use(koaBunyanLogger(log))
  server.use(helmet())
  server.use(cors({
    credentials: true
  }))
  server.use(bodyParser())
  server.use(session({
    key: 'sess',
    maxAge: ms('0.5y'), // half-year
    // secure: true, // Need HTTPS on development
    httpOnly: true,
    signed: true
  }, server))

  // server.use(cache({
  //   expire: 5,
  //   routes: [
  //     '/api/post'
  //   ]
  // }))

  server.use(async (ctx, next) => {
    ctx.__next = client
    ctx.res.statusCode = 200
    ctx.req.session = ctx.session
    ctx.req.cookies = ctx.cookies
    await next()
  })

  // server.use(async (ctx, nect) => {
  //   ctx.__cachedRender = renderAndCache

  //   await next()
  // })

  server.use(routes.routes())

  server.listen(config.server.port, () => {
    log.info(`server is running on port: ${config.server.port}`)
  })
})

// function getCacheKey (req) {
//   return `${req.url}`
// }

// function renderAndCache (ctx, pagePath, queryParams) {
//   const { req, res } = ctx
//   const key = getCacheKey(req)

//   // If we have a page in the cache, let's serve it
//   if (ssrCache.has(key)) {
//     console.log(`CACHE HIT: ${key}`)
//     ctx.send(ssrCache.get(key))
//     return
//   }

//   // If not let's render the page into HTML
//   client.renderToHTML(req, res, pagePath, queryParams)
//     .then((html) => {
//       // Let's cache this page
//       console.log(`CACHE MISS: ${key}`)
//       ssrCache.set(key, html)

//       ctx.send(html)
//     })
//     .catch((err) => {
//       client.renderError(err, req, res, pagePath, queryParams)
//     })
// }
