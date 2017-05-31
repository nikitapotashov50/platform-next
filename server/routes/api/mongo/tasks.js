const { models } = require('mongoose')
const { pick, extend } = require('lodash')

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
      let [ replied, active, knife ] = await Promise.all([
        ctx.__.me.getRepliedTasks(programId),
        ctx.__.me.getActiveTasks(programId),
        ctx.__.me.getKnifePlans(programId)
      ])
      console.log(knife)

      ctx.body = {
        status: 200,
        result: { active, replied, knife }
      }
    } catch (e) {
      console.log(e)
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

          if (ctx.__.task.replyTypeId === 2) {
            let [ plan ] = await models.KnifePlan.find({ _id: specific.type.item }).limit(1)
            specific = plan
          }
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

    router.post('/reply', async ctx => {
      let body = ctx.request.body
      let user = ctx.__.me

      let data = extend(pick(body, [ 'content' ]), { program: ctx.__.task.targetProgram })

      try {
        let isReplied = await ctx.__.task.checkReply(ctx.__.me)
        if (isReplied) throw new Error('already replied')

        data.title = ctx.__.task.title
        let post = await models.Post.addPost(data, { user })

        let additional = {}
        let whatIfPlan = null

        if (ctx.__.task.replyTypeId === 3) {
          let entry = await ctx.__.me.addGoal(pick(body, [ 'a', 'b', 'occupation' ]))
          additional.specific = { model: 'Goal', item: entry }
        } else if (ctx.__.task.replyTypeId === 2) {
          let options = {
            title: 'План-кинжал на неделю',
            content: body.action,
            programId: ctx.__.task.targetProgram
          }
          let { task, plan } = await models.Task.createKnifePlan(ctx.__.me, pick(body, [ 'goal', 'price', 'action' ]), options)
          whatIfPlan = plan
          additional.specific = { model: 'Task', item: task }
        }

        let reply = await ctx.__.task.addReply(user, post, additional)
        let [ statusData ] = await reply.getStatus()

        ctx.body = {
          status: 200,
          result: { reply, specific: whatIfPlan || additional, status: statusData.status }
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
