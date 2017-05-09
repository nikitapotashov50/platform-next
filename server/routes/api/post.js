const { models } = require('../../models')

module.exports = router => {
  // список всех постов
  router.get('/', async ctx => {
    const data = await models.Post.findAll({
      attributes: ['id', 'title', 'content'],
      include: [{
        model: models.User,
        attributes: ['name', 'first_name', 'last_name', 'picture_small'],
        as: 'user'
      }],
      limit: 20,
      order: [['created_at', 'desc']]
    })
    ctx.body = data
  })

  // создание поста
  router.post('/', async ctx => {
    const postData = ctx.request.body

    const created = await models.Post.create({
      title: postData.title,
      content: postData.content,
      type: 'user',
      user_id: ctx.session.user.id
    })

    const data = await models.Post.findOne({
      where: {
        id: created.id
      },
      attributes: ['id', 'title', 'content'],
      include: [{
        model: models.User,
        attributes: ['name', 'first_name', 'last_name', 'picture_small'],
        as: 'user'
      }]
    })
    ctx.body = data
  })
}
