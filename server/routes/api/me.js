const { models } = require('../../models')

const initInteractions = async (ctx, next) => {
  let { id } = ctx.request.body

  let User = await models.User.findOne({
    where: { id }
  })

  if (!User) {
    ctx.status = 403
    ctx.body = {
      status: 403,
      message: 'No user found'
    }
  } else {
    ctx.__.target = User
    await next()
  }
}

module.exports = router => {
  router.put('/edit', async ctx => {
    let body = ctx.request.body

    await ctx.__.me.update(body)
    ctx.session.user = Object.assign({}, ctx.session.user, ctx.__.me.toJSON())

    ctx.body = {
      status: 200,
      result: {
        user: ctx.__.me
      }
    }
  })

  router.bridge('/interact', [ initInteractions ], router => {
    router.bridge('/subscribe', router => {
      router.post('/', async ctx => {
        await ctx.__.me.addSubscriptions([ ctx.__.target ])
        ctx.body = { status: 200 }
      })
      router.put('/', async ctx => {
        await ctx.__.me.removeSubscription([ ctx.__.target ])
        ctx.body = { status: 200 }
      })
    })

    router.bridge('/block', router => {
      router.post('/', async ctx => {
        await ctx.__.me.addBlackList([ ctx.__.target ])
        ctx.body = { status: 200 }
      })
      router.put('/', async ctx => {
        await ctx.__.me.removeBlackList([ ctx.__.target ])
        ctx.body = { status: 200 }
      })
    })
  })
}
