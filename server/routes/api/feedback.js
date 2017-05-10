const { models } = require('../../models')

module.exports = router => {
  router.get('/', async ctx => {
    let nps = await models.NPS.findAll({
      limit: 30
    })

    ctx.body = {
      nps
    }
  })
}
