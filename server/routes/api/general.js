const services = require('../../services')
const { models } = require('../../models')

module.exports = router => {
  router.post('/login', async ctx => {
    ctx.body = {
      ok: true
    }
  })

  router.get('/version', services.general.getAPIVersionService)

  router.get('/user/:username', async ctx => {
    let user = await models.User.findOne({
      where: {
        name: ctx.params.username
      }
    })

    ctx.body = {
      user
    }
  })
}
