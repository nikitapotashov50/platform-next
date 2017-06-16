const { models } = require('mongoose')

module.exports = router => {
  router.get('/', async ctx => {
    const nps = await models.NPS.aggregate([
      {
        $match: {
          enabled: true,
          'target.model': 'Post'
        }
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'target.item',
          foreignField: '_id',
          as: 'post'
        }
      },
      {
        $unwind: '$post'
      },
      {
        $project: {
          post: 1,
          total: {
            $switch: {
              branches: [
                { case: { $gte: [ '$total', 9 ] }, then: 1 },
                { case: { $lte: [ '$total', 6 ] }, then: -1 }
              ],
              default: 0
            }
          },
          _id: 1
        }
      },
      {
        $group: {
          _id: '$post.userId',
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          total: { $divide: [ { $multiply: [ '$total', 100 ] }, '$count' ] }
        }
      }
    ])

    ctx.body = {
      nps
    }
  })
}
