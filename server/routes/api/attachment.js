const { models } = require('../../models')

module.exports = router => {
  router.post('/', async ctx => {
    console.log('receive', ctx.request.body)

    await models.Attachment.create({
      name: 'luuul'
    })

    ctx.body = {
      ok: true
    }
  })
}
