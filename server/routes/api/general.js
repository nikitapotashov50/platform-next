const Router = require('koa-router')
const { messages } = require('../../factories')
const services = require('../../services')
const { models } = require('../../models')


module.exports = router => {
  // router.get('/', (ctx, next) => {
  //   ctx.body = messages.generic.success
  // })

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
