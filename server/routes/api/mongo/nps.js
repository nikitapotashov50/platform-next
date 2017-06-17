const { models } = require('mongoose')

module.exports = router => {
  router.get('/', async ctx => {

  })

  router.get('/stats', async ctx => {
    let { type } = ctx.query

    try {
      let params
      let group

      if (type === 'program') {
        params = {
          programId: 4,
          'target.model': 'ProgramClass'
        }

        group = {
          programId: '$programId',
          target: '$target.model'
        }
      }
      if (type === 'platform') {
        params = {
          programId: 4,
          'target.model': 'Platform'
        }

        group = {
          programId: '$programId',
          target: '$target.model'
        }
      }

      let data = await models.NPS.getTotal({ params, group })

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
    let { limit, page, type } = ctx.query
    let params = {}

    if (type === 'program') {
      params = {
        programId: 4,
        'target.model': 'ProgramClass'
        // $or: [
        //   { 'target.model': null }
        // ]
      }
    }
    if (type === 'platform') {
      params = {
        programId: 4,
        'target.model': 'Platform'
      }
    }

    let { total, docs } = await models.NPS.getList(params, { limit, page })

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
