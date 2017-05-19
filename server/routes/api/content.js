const { models } = require('../../models')

module.exports = router => {
  router.get('/:program', async ctx => {
    const { program } = ctx.params
    const data = await models.Post.findAll({
      attributes: ['id', 'title', 'content', 'type', 'views'],
      include: [
        {
          attributes: ['name'],
          model: models.Tag,
          as: 'Tags'
        },
        {
          model: models.Program,
          where: {
            id: program
          },
          attributes: []
        },
        {
          attributes: ['cover', 'file', 'video', 'type', 'views', 'free'],
          model: models.ContentPost
        }
      ],
      where: {
        type: 'content'
      }
    })
    ctx.body = data
  })
}
