const { models } = require('mongoose')

module.exports = router => {
  router.bridge('/tasks', router => {
    router.get('/grab', async ctx => {
      try {
        let data = await models.TaskReply.getNotVerified()

        ctx.body = {
          status: 200,
          result: { data }
        }
      } catch (e) {
        console.log(e)
        ctx.body = { status: 500 }
      }
    })
  })
}
