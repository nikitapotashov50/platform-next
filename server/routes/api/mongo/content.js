const { models } = require('mongoose')

module.exports = router => {
  router.get('/', async ctx => {})

  router.get('/list', async ctx => {
    let { programId } = ctx.request.query

    try {
      if (!programId) throw new Error('no program specified')
      programId = Number(programId)

      let data = models.Post.find().limit(7)

      ctx.body = {
        status: 200,
        result: { items: data }
      }
    } catch (e) {
      ctx.log.info(e)
      ctx.body = { status: 500, message: e }
    }
  })
}
