const { models } = require('../../models')

module.exports = router => {
  // список всех постов
  router.get('/', async ctx => {
    const offset = Number(ctx.query.offset) || 0
    const data = await models.Post.findAll({
      attributes: ['id', 'title', 'content', 'user_id', 'created_at'],
      order: [['created_at', 'desc']],
      include: [{
        model: models.User,
        attributes: ['id', 'name', 'first_name', 'last_name'],
        as: 'user'
      }, {
        model: models.Comment,
        attributes: ['id', 'content', 'created_at'],
        as: 'comments',
        include: [{
          model: models.User,
          attributes: ['id', 'name', 'first_name', 'last_name'],
          as: 'user'
        }]
      }],
      limit: 20,
      offset
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

  // удаление поста
  router.delete('/:id', async ctx => {
    const post = await models.Post.findOne({
      where: {
        id: ctx.params.id
      }
    })

    if (post) {
      await post.destroy()
    }

    ctx.statusCode = 200
  })

  // список комментариев поста
  router.get('/:id/comments', async ctx => {
    const data = await models.Comment.findAll({
      attributes: ['id', 'content'],
      where: {
        post_id: ctx.params.id
      },
      limit: 20,
      order: [['created_at', 'desc']]
    })
    ctx.body = data
  })

  // создание комментария
  router.post('/:id/comment', async ctx => {
    const { content } = ctx.request.body
    const created = await models.Comment.create({
      content,
      post_id: ctx.params.id,
      user_id: ctx.session.user.id
    })

    const data = await models.Comment.findOne({
      where: {
        id: created.id
      },
      attributes: ['id', 'post_id', 'content']
    })
    ctx.body = data
  })
}
