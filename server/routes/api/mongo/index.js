let meRoutes = require('./me')
let postRoutes = require('./posts')
let usersRoutes = require('./users')
let tasksRoutes = require('./tasks')
let adminRoutes = require('./admin')
let npsRoutes = require('./nps')
let volunteerRoutes = require('./volunteer')
let feedbackRoutes = require('./feedback')

const { checkAccess, initMeRoutes, getSessionProgram } = require('../../../controllers/middlewares')

module.exports = router => {
  router.bridge('/me', [ initMeRoutes ], meRoutes)
  router.bridge('/posts', postRoutes)
  router.bridge('/users', usersRoutes)
  router.bridge('/tasks', [ initMeRoutes ], tasksRoutes)
  router.bridge('/admin', [ initMeRoutes, checkAccess('admin') ], adminRoutes)
  router.bridge('/nps', [ initMeRoutes, checkAccess('admin') ], npsRoutes)
  //
  router.bridge('/feedback', [ initMeRoutes, getSessionProgram ], feedbackRoutes)
  // TODO: check volunteer access
  router.bridge('/volunteer', [ initMeRoutes ], volunteerRoutes)
}
