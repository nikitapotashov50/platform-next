const Koa  = require('koa'),
  config = require('./config'),
  routes = require('./routes'),
  cluster = require('cluster'),
  numCPUs = require('os').cpus().length,
  bodyParser = require('koa-bodyparser'),
  passport = require('koa-passport'),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({name: "route"}),
  cors = require('koa2-cors');

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {

  let app = new Koa();
  app.use(bodyParser());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cors());

  routes(app);

  app.listen(config.server.port, ()=> {
    log.info(`app is running on port: ${config.server.port}`);
  });

}