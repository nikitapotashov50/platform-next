const { models } = require('mongoose')

const responseMoqup = (err = null, data = {}) => ({
  status: err ? err.status : 200,
  message: err ? err.message : undefined,
  result: data
})

const initGroup = async (ctx, next) => {
  try {
    if (!ctx.params.groupId) throw new Error({ status: 400, message: `Group _id is not defined` })
    let [ group ] = await models.Group.find({ _id: ctx.params.groupId }).limit(1).populate('specific.item')
    if (!group) throw new Error({ status: 400, message: `Group ${ctx.params.groupId} not found` })
    ctx.__.group = group

    await next()
  } catch (e) {
    ctx.body = responseMoqup(e)
  }
}

module.exports = router => {
  router.get('/', async ctx => {
    ctx.body = responseMoqup({ status: 404, message: 'Not found' })
  })

  router.bridge('/group/:groupId', [ initGroup ], router => {
    router.get('/', async ctx => {
      ctx.body = responseMoqup(null, { group: ctx.__.group })
    })

    router.get('/users', async ctx => {
      let users = await models.Users.getShortInfo(ctx.__.group.users)

      ctx.body = responseMoqup(null, { group: ctx.__.group, users })
    })
  })
}
