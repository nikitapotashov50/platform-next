const { models } = require('mongoose')

module.exports = router => {
  router.get('/all/:program/:userId', async ctx => {
    const res = await models.Users
      .find({})
      .populate({
        path: 'goals',
        match: { closed: false },
        options: {
          limit: 1,
          sort: { created: -1 }
        }
      })
      .limit(3)
    const goal = res[1].goals[0]
    ctx.body = goal.addIncome
  })

  router.post('/', async ctx => {
    const res = await models.Users
      .findOne({
        email: 'meganester@yandex.ru'
      })
    ctx.body = res
  })
}
