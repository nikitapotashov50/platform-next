const { models } = require('mongoose')

module.exports = router => {
  router.get('/all/:program/:userId', async ctx => {
    const { program } = ctx.params
    const income = await models.Income.aggregate([
      { $match: {
        enabled: true,
        programId: +program
      }},
      { $group: {
        _id: {
          userId: '$userId',
          programId: '$programId'
        },
        // вычисляем количество
        money: { $sum: '$amount' }
      }},
      { $sort: {
        money: -1
      }},
      { $project: {
        userId: '$_id.userId',
        programId: '$_id.programId',
        money: 1,
        _id: 0
      }}
    ])

    const usersWithIncome = await models.Income.populate(income, {
      path: 'userId',
      select: '_id name first_name last_name picture_small'
    })

    const idsWithIncome = usersWithIncome.map(user => user.userId._id)
    const restUsers = await models.Users
      .find({
        'programs.programId': { $in: [program] }
      })
      .select('_id name first_name last_name picture_small')
      .limit(100 - idsWithIncome.length)
    const restUsersMapped = restUsers.filter(user => idsWithIncome.indexOf(user._id) === -1).map(user => ({
      userId: user,
      money: 0,
      programId: +program
    }))
    const result = usersWithIncome.concat(restUsersMapped)
    ctx.body = result
  })
}
