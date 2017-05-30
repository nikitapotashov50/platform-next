const { models } = require('mongoose')
const { pick, extend } = require('lodash')
// const mongoose = require('mongoose')

// const ObjectId = mongoose.Types.ObjectId

let defaultReplies = [
  {
    title: 'Я ответил',
    content: 'Ответ на задание',
    userName: 'bm-paperdoll',
    task: 'Тестовое задание'
  }
]

const initTask = async (ctx, next) => {
  try {
    // if (!ObjectId.isValid(ctx.params.taskId)) throw { status: 404, message: 'Task not found' } // eslint-disable-line no-throw-literal
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

      let status = await reply.getStatus()

      ctx.body = {
        status: 200,
        result: { reply }
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

  router.get('/defaults', async ctx => {
    await models.TaskReply.initDefaults(defaultReplies)

    ctx.body = {
      status: 200
    }
  })
}
