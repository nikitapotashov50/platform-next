const { models } = require('mongoose')

const initTask = async (ctx, next) => {
  try {
    let [ task ] = await models.Task.find({ _id: ctx.params.taskId }).limit(1)
    if (!task) throw { status: 404, message: 'Task not found' } // eslint-disable-line no-throw-literal

    ctx.__.task = task
    await next()
  } catch (e) {
    ctx.body = {
      status: 404
    }
  }
}

module.exports = router => {
  router.get('/', async ctx => {
    let programId = ctx.query.programId
    try {
      let [ active, knife ] = await Promise.all([
        ctx.__.me.getActiveTasks(programId),
        ctx.__.me.getKnifePlans(programId)
      ])

      ctx.body = {
        status: 200,
        result: { active, knife }
      }
    } catch (e) {
      ctx.body = { status: 500, message: e }
    }
  })

  router.get('/knife', async ctx => {
    try {
      let active = await ctx.__.me.getKnifePlans(ctx.query.programId)

      ctx.body = { status: 200, result: { active } }
    } catch (e) {
      ctx.body = { status: 500, message: e }
    }
  })

  router.get('/active', async ctx => {
    try {
      let active = await ctx.__.me.getActiveTasks(ctx.query.programId)

      ctx.body = { status: 200, result: { active } }
    } catch (e) {
      ctx.body = { status: 500, message: e }
    }
  })

  router.get('/rejected', async ctx => {
    try {
      let active = await ctx.__.me.getRepliedByStatus(ctx.query.programId, 4)

      ctx.body = { status: 200, result: { active } }
    } catch (e) {
      ctx.body = { status: 500, message: e }
    }
  })

  router.get('/approved', async ctx => {
    try {
      let active = await ctx.__.me.getRepliedByStatus(ctx.query.programId, 3)

      ctx.body = { status: 200, result: { active } }
    } catch (e) {
      ctx.body = { status: 500, message: e }
    }
  })

  router.get('/pending', async ctx => {
    try {
      let active = await ctx.__.me.getRepliedByStatus(ctx.query.programId, [ 1, 2 ])

      ctx.body = { status: 200, result: { active } }
    } catch (e) {
      ctx.body = { status: 500, message: e }
    }
  })

  router.get('/count', async ctx => {
    try {
      let count = await models.TaskVerification.getRejectedRepliesCount(ctx.__.me._id, ctx.session.currentProgram)

      ctx.body = {
        status: 200,
        result: { count }
      }
    } catch (e) {
      ctx.body = { status: 500 }
    }
  })

  router.bridge('/:taskId', [ initTask ], router => {
    router.get('/', async ctx => {
      try {
        let replyType = await models.TaskReplyType.findOne({
          _id: ctx.__.task.replyTypeId
        })

        ctx.body = {
          status: 200,
          result: {
            task: ctx.__.task,
            replyType: replyType.code
          }
        }
      } catch (e) {
        ctx.body = { status: 500 }
      }
    })

    router.get('/reply', async ctx => {
      try {
        let [ reply ] = await models.TaskReply
          .find({
            userId: ctx.__.me._id,
            taskId: ctx.__.task._id,
            enabled: true
          })
          .limit(1)
          .sort({ created: -1 })
          .populate({
            path: 'specific.item'
          })

        let status = null
        let specific = null

        if (reply) {
          let [ statusData ] = await reply.getStatus()
          status = statusData ? statusData.status : null
          specific = reply.specific.item || null
        }

        ctx.body = {
          status: 200,
          result: { reply, status, specific }
        }
      } catch (e) {
        ctx.log.info(e)
        ctx.body = {
          status: 500,
          message: e
        }
      }
    })

    // TODO: Объединить все в один метод
    router.post('/reply', async ctx => {
      let body = ctx.request.body
      let user = ctx.__.me

      try {
        let { reply, specific } = await ctx.__.task.addReply(user, body)
        let [ statusData ] = await reply.getStatus()

        ctx.body = {
          status: 200,
          result: { reply, specific, status: statusData.status }
        }
      } catch (e) {
        ctx.log.info(e)
        ctx.body = {
          status: 500,
          message: e
        }
      }
    })
  })
}
