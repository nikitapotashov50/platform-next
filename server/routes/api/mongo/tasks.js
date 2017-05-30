const { models } = require('mongoose')
const { pick, extend } = require('lodash')

const initTask = async (ctx, next) => {
  try {
    let task = await models.Task.findOne({ _id: ctx.params.taskId })
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
  router.get('/defaults', async ctx => {
    // await models.TaskReply.initDefaults(defaultReplies)

    // ctx.body = {
    //   status: 200
    // }
    try {
      let user = await models.Users.findOne({ name: 'bm-paperdoll' })
      await user.addIncome(10000, 3)
      ctx.body = { status: 200 }
    } catch (e) {
      console.log(e)
      ctx.body = {
        status: 500,
        message: e
      }
    }
  })
  router.get('/', async ctx => {
    let programId = ctx.query.programId
    try {
      let [ replied, active ] = await Promise.all([
        ctx.__.me.getRepliedTasks(programId),
        ctx.__.me.getActiveTasks(programId)
      ])

      ctx.body = {
        status: 200,
        result: { active, replied }
      }
    } catch (e) {
      ctx.body = { status: 500, message: e }
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
      let reply = await models.TaskReply
        .findOne({
          userId: ctx.__.me._id,
          taskId: ctx.__.task._id,
          enabled: true
        })

      let status = null
      if (reply) {
        let statusData = await reply.getStatus()
        status = statusData.status
      }

      ctx.body = {
        status: 200,
        result: { reply, status }
      }
    })

    router.post('/reply', async ctx => {
      let body = ctx.request.body
      let user = ctx.__.me

      let data = extend(pick(body, [ 'content' ]), { program: 3 })

      // ответ на задание - это пост, так что перым делом создадим пост
      try {
        data.title = 'Ответ на задание'
        let post = await models.Post.addPost(data, { user })
        ctx.log.info('post is', post)

        let reply = await ctx.__.task.addReply(user, post)

        ctx.body = {
          status: 200,
          result: { reply }
        }
      } catch (e) {
        ctx.body = {
          status: 500,
          message: e
        }
      }
    })
  })
}
