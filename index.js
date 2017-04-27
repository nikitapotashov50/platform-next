const Koa = require('koa')
const config = require('./config')
const routes = require('./routes')
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport')
const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'platform'})
const cors = require('koa2-cors')
const helmet = require('koa-helmet')
const responseTime = require('koa-response-time')

const app = new Koa()

app.use(responseTime())
app.use(helmet())
app.use(bodyParser())
app.use(passport.initialize())
app.use(passport.session())
app.use(cors())
app.use(routes)

app.listen(config.server.port, () => {
  log.info(`app is running on port: ${config.server.port}`)
})
