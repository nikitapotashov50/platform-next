const { models } = require('mongoose')
const { keyObj } = require('../../../controllers/common')

const getReply = async (ctx, next) => {
  let replyId = ctx.params.replyId
  try {
    if (!replyId) throw new Error('no reply id')
    let [ reply ] = await models.TaskReply.find({ _id: replyId }).limit(1)
    if (!reply) throw new Error('no reply found')

    ctx.__.reply = reply
    await next()
  } catch (e) {
    ctx.body = { status: 500, message: e }
  }
}

module.exports = router => {
  router.bridge('/tasks', router => {
    router.get('/list', async ctx => {
      let { programId } = ctx.query

      try {
        let data = await models.TaskReply.getNotVerified(programId)

        // TODO: убрать лишние поля из аггрегагции
        let replies = await models.TaskReply
          .find({
            _id: { $in: data.map(el => el.reply) }
          })
          .select('_id title taskId userId postId specific content created')
          .populate([
            'specific.item',
            { path: 'taskId', select: 'title' },
            { path: 'postId', select: 'title content' }
          ])
          .sort({ created: -1 })
          // .lean()
          // .cache(60)

        let users = await models.Users.getShortInfo(replies.map(el => el.userId))

        ctx.body = {
          status: 200,
          result: {
            users: keyObj(users),
            tasks: replies
          }
        }
      } catch (e) {
        console.log(e)
        ctx.body = { status: 500 }
      }
    })

    router.get('/count', async ctx => {
      let { programId } = ctx.query
      programId = Number(programId)
      try {
        let data = await models.TaskVerification.getLastForReplies({ programId })

        ctx.body = {
          status: 200,
          result: {
            count: data
          }
        }
      } catch (e) {
        console.log(e)
        ctx.body = { status: 500 }
      }
    })

    router.bridge('/:rplyId', [ getReply ], router => {
      router.put('/approve', async ctx => {
        let { body } = ctx.request
        try {
          let status = await ctx.__.reply.approve(body, ctx.__.me)
          if (!status) throw new Error('somethidng goes worng')
          ctx.body = {
            status: 200, result: { status }
          }
        } catch (e) {
          console.log(e)
          ctx.body = { status: 500, message: e }
        }
      })

      router.put('/reject', async ctx => {
        let { body } = ctx.request
        try {
          let status = await ctx.__.reply.reject(body, ctx.__.me)
          if (!status) throw new Error('somethidng goes worng')
          ctx.body = {
            status: 200, result: { status }
          }
        } catch (e) {
          console.log(e)
          ctx.body = { status: 500, message: e }
        }
      })
    })
  })
}
