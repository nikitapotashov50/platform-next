const meRoutes = require('./me')
const postRoutes = require('./posts')
const usersRoutes = require('./users')
const tasksRoutes = require('./tasks')
const adminRoutes = require('./admin')
const npsRoutes = require('./nps')
const volunteerRoutes = require('./volunteer')
const feedbackRoutes = require('./feedback')
const chatRoutes = require('./chat')
const groupRoutes = require('./groups')
const ratingRoutes = require('./rating')

const { checkAccess, initMeRoutes, getSessionProgram } = require('../../../controllers/middlewares')

module.exports = router => {
  router.bridge('/me', [ initMeRoutes ], meRoutes)
  router.bridge('/posts', postRoutes)
  router.bridge('/users', usersRoutes)
  router.bridge('/chat', chatRoutes)
  router.bridge('/tasks', [ initMeRoutes ], tasksRoutes)
  router.bridge('/admin', [ initMeRoutes, checkAccess('admin') ], adminRoutes)
  router.bridge('/nps', [ initMeRoutes ], npsRoutes)
  router.bridge('/groups', groupRoutes)
  router.bridge('/rating', ratingRoutes)
  // , checkAccess('admin')
  //
  router.bridge('/feedback', [ initMeRoutes, getSessionProgram ], feedbackRoutes)
  // TODO: check volunteer access
  router.bridge('/volunteer', [ initMeRoutes ], volunteerRoutes)
}
