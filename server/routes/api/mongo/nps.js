const { models } = require('mongoose')

module.exports = router => {
  router.get('/', async ctx => {

  })

  router.get('/stats', async ctx => {
    try {
      let data = await models.NPS.getTotal()

      ctx.body = {
        status: 200,
        result: { data }
      }
    } catch (e) {
      ctx.log.info(e)
      ctx.body = { status: 500 }
    }
  })

  router.get('/filters', async ctx => {})
}
