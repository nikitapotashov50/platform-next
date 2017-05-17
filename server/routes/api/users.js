const { models } = require('../../models')

module.exports = router => {
  router.get('/list', async ctx => {
    let { limit = 30, offset = 0 } = ctx.request.query
    let where = {}

    limit = parseInt(limit)
    offset = parseInt(offset)

    try {
      let { rows, count } = await models.User.findAndCountAll({
        where,
        limit,
        offset: limit * offset
      })

      ctx.body = {
        status: 200,
        result: {
          user: rows,
          tital: count
        }
      }
    } catch (e) {
      ctx.body = {
        status: 500,
        message: 'User list error: ' + e.message
      }
    }
  })
}
