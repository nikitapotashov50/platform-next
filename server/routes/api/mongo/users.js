const { models } = require('mongoose')
const { extend, pick, toLower } = require('lodash')
const { getBalance } = require('../../../controllers/tokenController')

module.exports = router => {
  // router.bridge('/list', router => {
  //   router.get('/', async ctx => {
  //     let { programId, notIn } = ctx.query
  //
  //     let params = {}
  //     if (programId) params['programs.programId'] = { $in: [ Number(programId) ] }
  //     if (notIn) params._id = { $nin: notIn.split(',') }
  //
  //     let users = await models.Users
  //       .find(params)
  //       .select('_id first_name last_name picture_small name goals')
  //       .populate({
  //         path: 'goals',
  //         match: { closed: false },
  //         select: 'a b occupation',
  //         options: {
  //           limit: 1,
  //           sort: { created: -1 }
  //         }
  //       })
  //       .limit(20)
  //       .lean()
  //
  //     ctx.body = {
  //       status: 200,
  //       result: { users }
  //     }
  //   })
  // })
  router.get('/test', async ctx => {
    try {
      let nps = await models.NPS.aggregate([
        { $match: {
          'target.model': 'Post',
          programId: { $in: [ 4 ] }
        }},
        { $lookup: {
          from: 'posts',
          localField: 'target.item',
          foreignField: '_id',
          as: 'post'
        }},
        { $unwind: '$post' },
        { $project: {
          userId: '$post.userId',
          total: {
            $switch: {
              branches: [
                { case: { $gte: [ '$total', 9 ] }, then: 1 },
                { case: { $lte: [ '$total', 6 ] }, then: -1 }
              ],
              default: 0
            }
          }
        }},
        { $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }},
        { $unwind: '$user' },
        { $match: {
          // $or: [
            // { 'user.name': { $regex: searchString } },
          //   { 'user.first_name': { $regex: searchString, $options: 'i' } },
          //   { 'user.last_name': { $regex: searchString } },
          //   { 'user.email': { $regex: searchString } }
          // ]
        }},
        { $group: {
          _id: {
            userId: '$userId',
            first_name: '$user.first_name',
            last_name: '$user.last_name',
            name: '$user.name'
          },
          count: { $sum: 1 },
          total: { $sum: '$total' }
        }},
        { $project: {
          _id: '$_id.userId',
          first_name: '$_id.first_name',
          last_name: '$_id.last_name',
          name: '$_id.name',
          total: { $divide: [ { $multiply: [ '$total', 100 ] }, '$count' ] }
        }},
        { $sort: { total: -1 } }
      ])

      ctx.body = { status: 200, result: { nps } }
    } catch (e) {
      ctx.log.info(e)
      ctx.body = { status: 500, message: e }
    }
  })

  router.get('/list', async ctx => {
    let { limit = 20, userIds, searchString } = ctx.request.query

    let query = {}
    if (userIds) query._id = { $in: userIds.split(',') }
    if (searchString !== '') {
      searchString = toLower(decodeURIComponent(searchString))
      query['$or'] = [
        { name: { $regex: searchString } },
        { first_name: { $regex: searchString, $options: 'i' } },
        { last_name: { $regex: searchString } },
        { email: { $regex: searchString } }
      ]
    }

    try {
      let users = await models.Users
        .find(query)
        .select('_id name first_name last_name picture_small')
        .lean()
        .limit(Number(limit))

      ctx.body = {
        status: 200,
        result: { users }
      }
    } catch (e) {
      ctx.log.info(e)
      ctx.body = { status: 500, message: e }
    }
  })

  router.bridge('/:username', router => {
    router.get('/', async ctx => {
      let [ user ] = await models.Users
        .find({ name: ctx.params.username })
        .populate([
          { path: 'info', select: 'vk facebook instagram website gender social_status birthday' },
          { path: 'meta', select: 'radar_id wallet molodost_id' }
        ])
        .limit(1)
        // .cache(120)
        .select('meta name first_name last_name picture_small picture_large _id info goals subscriptions')

      let { goal, progress = 0 } = await user.getGoal(ctx.session.currentProgram)
      let groups = await user.getGroups(3)
      let subscribers = await user.getSubscribers(6)
      let balance = null

      if (user.meta.wallet && user.meta.molodost_id) {
        try {
          let tokenResponse = await getBalance(user.meta.molodost_id)
          if (tokenResponse.success) balance = tokenResponse.data.user.balance
        } catch (e) {
          ctx.log.info(e)
        }
      }

      ctx.body = {
        status: 200,
        result: {
          user,
          balance,
          info: user.info,
          goal: goal ? extend({}, pick(goal, [ 'a', 'b', 'occupation' ]), { progress }) : null,
          groups: groups.list,
          //
          subscribers: subscribers.list,
          subscribers_total: subscribers.total,
          // //
          // goal: (user.goals || []).shift(),
          subscriptions: user.subscriptionsCount
        }
      }
    })
  })
}
