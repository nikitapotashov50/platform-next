const { models } = require('mongoose')
const { extend, pick } = require('lodash')

module.exports = router => {
  router.bridge('/:username', router => {
    router.get('/', async ctx => {
      let user = await models.Users
        .findOne({
          name: ctx.params.username
        })
        .populate([ 'info' ])
        .populate('meta', 'radar_id')
        .select('meta name first_name last_name picture_small picture_large _id info goals subscriptions')

      let { goal, progress = 0 } = await user.getGoal(ctx.session.currentProgram)
      let groups = await user.getGroups(3)
      let subscribers = await user.getSubscribers(6)

      ctx.body = {
        status: 200,
        result: {
          user,
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
