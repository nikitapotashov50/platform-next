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
    let { limit, page } = ctx.query
    let { total, docs } = await models.NPS.getList({}, { limit, page })

    ctx.body = {
      status: 200,
      result: { total, items: docs }
    }
  })

  router.get('/filters', async ctx => {
    let { type } = ctx.query
    try {
      if ([ 'program', 'platform' ].indexOf(type) === -1) throw new Error('wrong filter type')

      let filters = {}
      console.log(type)
      if (type === 'program') {
        let programs = await models.Program.find({ _id: { $nin: [ 6 ] } }).sort({ _created: -1 }).select('_id title')
        let classes = await models.ProgramClass.getGrouped({ programId: { $in: programs.map(el => el._id) } })
        filters = { programs, classes }
      }

      ctx.body = {
        status: 200,
        result: { filters }
      }
    } catch (e) {
      ctx.log.info(e)
      ctx.body = { status: 500, message: e }
    }
  })
}
