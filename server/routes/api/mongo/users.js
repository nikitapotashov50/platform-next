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

  router.get('/list', async ctx => {
    let { limit = 20, searchString } = ctx.request.query

    let match = {}

    if (searchString !== '') {
      searchString = toLower(decodeURIComponent(searchString))

      let regexStr = new RegExp(searchString, 'i')

      match['$or'] = [
        { fullname_1: regexStr },
        { fullname_2: regexStr },
        { name: regexStr },
        { email: regexStr }
      ]
    }

    try {
      let users = await models.Users
        .aggregate([
          {
            $project: {
              name: true,
              first_name: true,
              last_name: true,
              picture_small: true,
              email: true,
              fullname_1: {
                $concat: ['$first_name', ' ', '$last_name']
              },
              fullname_2: {
                $concat: ['$last_name', ' ', '$first_name']
              }
            }
          }, {
            $match: match
          }, {
            $limit: Number(limit)
          }
        ])

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

      // if (user.meta.wallet && user.meta.molodost_id) {
      //   try {
      //     let tokenResponse = await getBalance(user.meta.molodost_id)
      //     if (tokenResponse.success) balance = tokenResponse.data.user.balance
      //   } catch (e) {
      //     ctx.log.info(e)
      //   }
      // }

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
