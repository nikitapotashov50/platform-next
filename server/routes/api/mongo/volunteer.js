const { flatten } = require('lodash')
const { models } = require('mongoose')
const { keyObj } = require('../../../controllers/common')

module.exports = router => {
  router.bridge('/tasks', router => {
    router.get('/list', async ctx => {
      let { programId } = ctx.query

      try {
        // let data = await models.TaskReply.getNotVerified(task)
        let data = await models.Task.aggregate([
          { $match: {
            targetProgram: Number(programId),
            replyTypeId: 4
          }},
          { $project: {
            _id: 1,
            title: 1
          }},
          { $lookup: {
            from: 'taskreplies',
            localField: '_id',
            foreignField: 'taskId',
            as: 'reply'
          }},
          { $unwind: '$reply' },
          { $project: {
            task: {
              _id: '$_id',
              title: '$title'
            },
            reply: '$reply._id',
            _id: 0
          }},
          { $lookup: {
            from: 'taskverifications',
            localField: 'reply',
            foreignField: 'taskReplyId',
            as: 'verifications'
          }},
          { $unwind: '$verifications' },
          { $sort: {
            'verifications.created': 1
          }},
          { $group: {
            _id: {
              reply: '$reply',
              task: '$task'
            },
            verification: { $last: '$verifications' }
          }},
          { $match: {
            'verification.status': { $nin: [ 3, 4 ] }
          }},
          { $project: {
            _id: 0,
            task: '$_id.task',
            reply: '$_id.reply',
            status: '$verification'
          }}
        ])
        // TODO: убрать лишние поля из аггрегагции
        let replies = await models.TaskReply
          .find({
            _id: { $in: data.map(el => el.reply) }
          })
          .select('_id title userId postId specific content created')
          .populate([
            'specific.item',
            { path: 'postId', select: 'title content' }
          ])
          .sort({ created: -1 })
          .lean()
          .cache(60)

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
      try {
        let replyIds = await models.TaskVerification.getLastForReplies()

        let data = await models.TaskReply.aggregate([
          // отсеим проверенные
          { $match: {
            replyTypeId: 4,
            _id: { $in: replyIds || [] }
          }},
          { $group: {
            _id: '$taskId',
            count: { $sum: 1 }
          }},
          { $lookup: {
            from: 'tasks',
            localField: '_id',
            foreignField: '_id',
            as: 'task'
          }},
          { $unwind: '$task' },
          { $match: {
            'task.targetProgram': Number(programId)
          }},
          { $group: {
            _id: '$task.type.model',
            data: { $addToSet: {
              title: '$task.title',
              _id: '$task._id',
              count: '$count'
            }},
            count: { $sum: 1 }
          }}
        ])

        let tasks = flatten(data.map(el => {
          if (el._id === 'KnifePlan') return { title: 'План-кинжал', _id: 'knifeplan', count: el.data.length || 0 }
          else return el.data
        }))

        ctx.body = {
          status: 200,
          result: {
            count: tasks
          }
        }
      } catch (e) {
        console.log(e)
        ctx.body = { status: 500 }
      }
    })
  })
}
