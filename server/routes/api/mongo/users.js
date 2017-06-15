const { models } = require('mongoose')
const { extend, pick } = require('lodash')
const { getBalance } = require('../../../controllers/tokenController')

module.exports = router => {
  router.bridge('/list', router => {
    router.get('/', async ctx => {
      let { programId, notIn } = ctx.query

      let params = {}
      if (programId) params['programs.programId'] = { $in: [ Number(programId) ] }
      if (notIn) params._id = { $nin: notIn.split(',') }

      let users = await models.Users
        .find(params)
        .select('_id first_name last_name picture_small name goals')
        .populate({
          path: 'goals',
          match: { closed: false },
          select: 'a b occupation',
          options: {
            limit: 1,
            sort: { created: -1 }
          }
        })
        .limit(20)
        .lean()

      ctx.body = {
        status: 200,
        result: { users }
      }
    })
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
        let tokenResponse = await getBalance(user.meta.molodost_id)
        if (tokenResponse.success) balance = tokenResponse.data.user.balance
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
