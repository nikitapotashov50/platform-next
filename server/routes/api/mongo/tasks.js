const { models } = require('mongoose')

const initTask = async (ctx, next) => {
  try {
    let params = { _id: ctx.params.taskId }
    if (!ctx.session.uid) throw { status: 403, message: 'Access denied' } // eslint-disable-line no-throw-literal
    params.targetProgram = ctx.session.currentProgram || null
    let [ task ] = await models.Task.find(params).limit(1).populate([ 'type.item' ])
    if (!task) throw { status: 404, message: 'Task not found' } // eslint-disable-line no-throw-literal

    ctx.__.task = task
    await next()
  } catch (e) {
    ctx.body = { status: e.status, message: e.message }
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
        let [ replyType ] = await models.TaskReplyType.find({ _id: ctx.__.task.replyTypeId }).limit(1)

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
          .populate([ 'specific.item' ])

        let post = null
        let status = null
        let specific = null

        if (reply) {
          let [ statusData ] = await reply.getStatus()
          status = statusData ? statusData.status : null
          specific = reply.specific.item || null
          post = await reply.getPost()
          post = post[0] || null
        }

        ctx.body = {
          status: 200,
          result: { reply, status, specific, post }
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
        let [ post ] = await reply.getPost()

        ctx.body = {
          status: 200,
          result: { reply, specific, status: statusData.status, post: post || null }
        }
      } catch (e) {
        ctx.log.info(e)
        ctx.body = {
          status: 500,
          message: e
        }
      }
    })

    router.put('/reply/:replyId', async ctx => {
      let user = ctx.__.me
      try {
        let [ reply ] = await models.TaskReply.find({ _id: ctx.params.replyId, userId: user._id }).limit(1)
        if (!reply) throw new Error('no reply found')

        let body = ctx.request.body

        let { specific, post } = await reply.editReply(body, user)
        let [ statusData ] = await reply.getStatus()

        ctx.body = {
          status: 200,
          result: { reply, specific, status: statusData.status, post: post || null }
        }
      } catch (e) {
        ctx.log.info(e)
        ctx.body = { status: 500, message: e }
      }
    })
  })
}
