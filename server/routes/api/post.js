const { models } = require('../../models')

module.exports = router => {
  router.get('/', async ctx => {
    const data = await models.Post.findAll({
      limit: 20
    })
    ctx.body = data
  })

  router.post('/', async ctx => {
    const postData = ctx.request.body

    await models.Post.create({
      title: postData.title,
      content: postData.body,
      type: 'user',
      user_id: postData.userId
    })
  })
}
