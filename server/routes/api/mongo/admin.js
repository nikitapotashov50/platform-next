const { models } = require('mongoose')

const initUser = async (ctx, next) => {
  try {
    let userId = ctx.params.userId
    let [ user ] = await models.Users.find({ _id: userId }).limit(1)
    if (!user) throw new Error('User not found')

    ctx.__.user = user
    await next()
  } catch (e) {
    console.log(e)
    ctx.body = { status: 404, message: e }
  }
}

module.exports = router => {
  router.bridge('/users', router => {
    router.get('/list', async ctx => {
      let { limit = 20, userIds, searchString } = ctx.request.query

      let query = {}
      if (userIds) query._id = { $in: userIds.split(',') }
      if (searchString) {
        searchString = decodeURIComponent(searchString)
        query['$or'] = [
          { name: { $regex: searchString } },
          { first_name: { $regex: searchString, $options: 'i' } },
          { last_name: { $regex: searchString } },
          { email: { $regex: searchString } }
        ]
      }

      try {
        let users = await models.Users
          .find(query)
          .select('_id name first_name last_name picture_small')
          .lean()
          .limit(Number(limit))

        ctx.body = {
          status: 200,
          result: { users }
        }
      } catch (e) {
        ctx.log.info(e)
        ctx.body = { status: 500, message: e }
      }
    })

    router.bridge('/:userId', [ initUser ], router => {
      router.get('/', async ctx => {
        let [ fullInfo ] = await models.Users
          .populate([ ctx.__.user ], [
            'role',
            'programs.programId',
            'programs.meta'
          ])

        ctx.body = {
          status: 200,
          result: { user: fullInfo }
        }
      })

      /**
       * TODO: допилить этот кусок
       */
      router.put('/', async ctx => {
        let { programRole } = ctx.request.body
        let role = models.ProgramRoles.rolesByCode[programRole.role]

        try {
          if (!role) throw new Error('no such role exists')
          let [ userProgram ] = ctx.__.user.programs.filter(el => el.programId === programRole.programId)
          if (!userProgram) throw new Error('User is not in this program')
          let [ meta ] = await models.ProgramUserMeta.find({ _id: userProgram.meta }).limit(1)
          if (!meta) throw new Error('no such meta exists')

          meta.roleId = role._id
          await meta.save()

          ctx.body = {
            status: 200,
            result: { meta }
          }
        } catch (e) {
          ctx.body = { status: 500, message: e }
        }
      })
    })
  })
}
