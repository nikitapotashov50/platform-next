const moment = require('moment')
const { models } = require('mongoose')
const { pick, isEmpty, extend } = require('lodash')

const initInteractions = async (ctx, next) => {
  try {
    let { id } = ctx.request.body
    if (!id) throw new Error('no user id specified')
    let user = await models.Users.findOne({ _id: id })

    if (!user) throw new Error('no user found')

    ctx.__.target = user
    await next()
  } catch (e) {
    ctx.body = { status: 404, message: 'No user found' }
  }
}

const initGoal = async (ctx, next) => {
  try {
    let goal = await models.Goal
      .findOne({
        userId: ctx.__.me._id,
        closed: false
      })
      .sort({ created: -1 })

    if (!goal) goal = await models.Goal.create({ userId: ctx.__.me._id, a: 0, b: 0 })

    ctx.__.goal = goal

    await next()
  } catch (e) {
    console.log(e)
    ctx.body = { status: 500, message: e }
  }
}

module.exports = router => {
  router.get('/edit', async ctx => {
    try {
      let info = await models.UsersInfo.getOrCreate(ctx.__.me._id)

      ctx.body = {
        status: 200,
        result: {
          info,
          user: ctx.__.me.getSessionInfo()
        }
      }
    } catch (e) {
      ctx.log.info(e)
      ctx.body = { status: 500, message: e }
    }
  })

  router.put('/edit', async ctx => {
    let body = ctx.request.body

    let userInfo = pick(body, [ 'vk', 'website', 'phone', 'facebook', 'instagram', 'about', 'hobbies', 'birthday', 'gender' ])
    let userMain = pick(body, [ 'first_name', 'last_name', 'locale' ])

    if (userInfo.birthday) userInfo.birthday = new Date(moment(userInfo.birthday, 'DD-MM-YYYY').format('YYYY-MM-DD'))

    if (!isEmpty(userInfo)) await ctx.__.me.updateInfo(userInfo)
    if (!isEmpty(userMain)) {
      ctx.__.me = extend(ctx.__.me, userMain)
      await ctx.__.me.save()
    }

    ctx.session.user = ctx.__.me.getSessionInfo()

    ctx.body = {
      status: 200,
      result: {
        user: ctx.__.me.getSessionInfo(),
        info: userInfo
      }
    }
  })

  router.bridge('/program', router => {
    router.put('/changeCurrent', ctx => {
      try {
        let programId = ctx.request.body.programId
        if (!programId) throw new Error('No program id specified')
        programId = Number(programId)
        let [ program ] = models.Program.find({ _id: programId }).limit(1)
        if (!program) throw new Error('no such program exists')

        ctx.session.currentProgram = program._id
        ctx.body = { status: 200 }
      } catch (e) {
        ctx.log.info(e)
        ctx.body = { status: 500 }
      }
    })
  })

  router.bridge('/goal', [ initGoal ], router => {
    router.get('/', ctx => {
      ctx.body = {
        status: 200,
        result: {
          goal: ctx.__.goal
        }
      }
    })

    router.put('/', async ctx => {
      let { a, b, occupation } = ctx.request.body

      try {
        let goal = await ctx.__.goal.update({ a, b, occupation })

        ctx.body = {
          status: 200,
          result: { goal }
        }
      } catch (e) {
        ctx.body = {
          status: 500,
          message: e.message
        }
      }
    })
  })

  router.bridge('/interact', [ initInteractions ], router => {
    router.bridge('/subscribe', router => {
      router.post('/', async ctx => {
        await ctx.__.me.addSubscription(ctx.__.target)
        ctx.body = { status: 200 }
      })
      router.put('/', async ctx => {
        await ctx.__.me.removeSubscription(ctx.__.target)
        ctx.body = { status: 200 }
      })
    })
  })
}
