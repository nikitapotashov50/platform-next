let meRoutes = require('./me')
let postRoutes = require('./posts')
let usersRoutes = require('./users')
let tasksRoutes = require('./tasks')

const { models } = require('mongoose')

const initMeRoutes = async (ctx, next) => {
  try {
    if (!ctx.session || !ctx.session.user) throw new Error('no user')

    let user = await models.Users.findOne({ _id: ctx.session.user._id })

    if (!user) throw new Error('no user found')

    ctx.__.me = user

    await next()
  } catch (e) {
    ctx.status = 403
    ctx.body = {
      status: 403,
      message: 'Access denied'
    }
  }
}

module.exports = router => {
  router.bridge('/me', [ initMeRoutes ], meRoutes)
  router.bridge('/posts', postRoutes)
  router.bridge('/users', usersRoutes)
  router.bridge('/myTasks', [], tasksRoutes)

  // router.get('/groups', async ctx => {
  //   let data = await models.Group
  //     .find({
  //       'specific.type': 'GameGroup',
  //       programs: { $in: [ 1 ] }
  //     })
  //     .populate([
  //       {
  //         path: 'users',
  //         select: '_id first_name last_name'
  //       },
  //       {
  //         path: 'specific.item'
  //       }
  //     ])
  //     .limit(20)

  //   ctx.body = {
  //     status: 200,
  //     result: { data }
  //   }
  // })
}
