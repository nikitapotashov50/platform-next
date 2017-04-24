const Koa = require('koa')
const config = require('./config')
const routes = require('./routes')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport')
const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'route'})
const cors = require('koa2-cors')

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
} else {
  let app = new Koa()
  app.use(bodyParser())
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(cors())

  routes(app)

  app.listen(config.server.port, () => {
    log.info(`app is running on port: ${config.server.port}`)
  })
}
