const Koa = require('koa')
const helmet = require('koa-helmet')
const responseTime = require('koa-response-time')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session2')
// const userAgent = require('koa2-useragent')
// const passport = require('koa-passport')
const cors = require('koa2-cors')
const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'platform'})
const config = require('./config')
const routes = require('./routes')

const app = new Koa()

app.use(responseTime())
app.use(helmet())
app.use(session({
  key: config.api.session_key
}))
// app.use(userAgent())
app.use(bodyParser())
// app.use(passport.initialize())
// app.use(passport.session())
app.use(cors())
app.use(routes)

app.listen(config.server.port, () => {
  log.info(`app is running on port: ${config.server.port}`)
})
