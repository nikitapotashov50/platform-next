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

  router.get('/entries', async ctx => {
    let data = await models.NPS.find()

    ctx.body = {
      status: 200,
      result: { data }
    }
  })

  router.get('/filters', async ctx => {
    let { type } = ctx.query
    try {
      if ([ 'programs', 'platform' ].indexOf(type) === -1) throw new Error('wrong filter type')

      let filters = {}
      if (type === 'programs') {}

      ctx.body = {
        status: 200,
        data: { filters }
      }
    } catch (e) {
      ctx.log.info(e)
      ctx.body = { status: 500, message: e }
    }
  })
}
