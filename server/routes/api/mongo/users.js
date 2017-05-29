const { models } = require('mongoose')

module.exports = router => {
  router.bridge('/:username', router => {
    router.get('/', async ctx => {
      let user = await models.Users
        .findOne({
          name: ctx.params.username
        })
        .populate([
          'info',
          {
            path: 'goals',
            match: { closed: false },
            select: 'a b occupation',
            options: { limit: 1 }
          }
        ])
        .select('name first_name last_name picture_small picture_large _id info goals, subscriptions')

      let groups = await user.getGroups(3)
      let subscribers = await user.getSubscribers(6)

      ctx.body = {
        status: 200,
        result: {
          user,
          groups: groups.list,
          //
          subscribers: subscribers.list,
          subscribers_total: subscribers.total,
          // //
          goal: (user.goals || []).shift(),
          subscriptions: user.subscriptionsCount
        }
      }
    })
  })
}
