const { models } = require('mongoose')
// const pMap = require('p-map')
// const { omit } = require('lodash')

module.exports = router => {
  router.get('/', async ctx => {
    let { limit = 20, offset = 0, searchString } = ctx.request.query

    limit = Number(limit)
    offset = Number(offset)

    let query = {}

    if (searchString) {
      searchString = decodeURIComponent(searchString)
      query = { $or: [
        { 'user.name': { $regex: searchString } },
        { 'user.first_name': { $regex: searchString, $options: 'i' } },
        { 'user.last_name': { $regex: searchString } },
        { 'user.email': { $regex: searchString } }
      ] }
    }

    const nps = await models.NPS.aggregate([
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
      { $match: query },
      { $group: {
        _id: {
          userId: '$userId',
          first_name: '$user.first_name',
          last_name: '$user.last_name',
          name: '$user.name',
          picture_small: '$user.picture_small'
        },
        count: { $sum: 1 },
        total: { $sum: '$total' }
      }},
      { $project: {
        _id: '$_id.userId',
        first_name: '$_id.first_name',
        last_name: '$_id.last_name',
        name: '$_id.name',
        picture_small: '$_id.picture_small',
        total: { $divide: [ { $multiply: [ '$total', 100 ] }, '$count' ] }
      }},
      { $sort: { total: -1 } },
      { $limit: limit },
      { $skip: offset }
      // { $lookup: {
      //   from: 'goals',
      //   localField: '_id',
      //   foreignField: 'userId',
      //   as: 'goal'
      // }},
      // { $unwind: '$goal' }
    ])

    // const data = await pMap(nps, async user => {
    //   const _user = await models.Users.findOne({ _id: user._id })
    //
    //   const [_program] = _user.programs.filter(x => x.programId === 4)
    //
    //   const programMeta = await models.ProgramUserMeta.findOne({ _id: _program.meta })
    //
    //   console.log('program meta', programMeta)
    //
    //   return omit(
    //     Object.assign({}, user, { occupation: user.goal.occupation }),
    //     'goal'
    //   )
    // })

    ctx.body = {
      nps
    }
  })
}
