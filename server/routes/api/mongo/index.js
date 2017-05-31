let meRoutes = require('./me')
let postRoutes = require('./posts')
let usersRoutes = require('./users')
let tasksRoutes = require('./tasks')

const { initMeRoutes } = require('../../../controllers/common')

module.exports = router => {
  router.bridge('/me', [ initMeRoutes ], meRoutes)
  router.bridge('/posts', postRoutes)
  router.bridge('/users', usersRoutes)
  router.bridge('/tasks', [ initMeRoutes ], tasksRoutes)
}
