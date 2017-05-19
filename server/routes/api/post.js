const { size, has } = require('lodash')
const pMap = require('p-map')
const { models } = require('../../models')

let initPostRoutes = async (ctx, next) => {
  try {
    let post = await models.Post.findOne({
      where: { id: ctx.params.id },
      include: [
        {
          model: models.User,
          attributes: ['id', 'name', 'first_name', 'last_name', 'picture_small'],
          as: 'user'
        }
      ]
    })

    if (!post) throw new Error('Post entry is not exists')
    ctx.__.post = post

    await next()
  } catch (e) {
    ctx.body = {
      status: 404,
      message: e.message
    }
  }
}

module.exports = router => {
  // список всех постов
  router.get('/', async ctx => {
    const offset = Number(ctx.query.offset) || 0
    let authors = has(ctx.query, 'by_author_id') ? ctx.query.by_author_id.split(',') : null

    // не показывать удаленные посты
    let where = {
      is_blocked: false
    }

    // посты конкретного юзера
    if (authors) {
      where.user_id = {
        $in: authors
      }
    }

    const data = await models.Post.findAll({
      attributes: ['id', 'title', 'content', 'user_id', 'created_at'], // [orm.fn('COUNT', orm.col('likes.id')), 'likes_count']
      order: [['created_at', 'desc']],
      include: [
        {
          model: models.User,
          attributes: ['id', 'name', 'first_name', 'last_name', 'picture_small'],
          as: 'user',
          include: [
            {
              required: false,
              model: models.Goal,
              where: {
                is_closed: false
              },
              attributes: [ 'occupation', 'id' ]
            }
          ]
        },
        {
          model: models.Comment,
          attributes: ['id', 'content', 'created_at'],
          as: 'comments',
          include: [
            {
              model: models.User,
              attributes: ['id', 'name', 'first_name', 'last_name', 'picture_small'],
              as: 'user'
            }
          ]
        },
        {
          model: models.Like,
          as: 'likes',
          attributes: ['id', 'created_at'],
          include: [
            {
              model: models.User,
              attributes: ['id', 'name', 'first_name', 'last_name', 'picture_small'],
              as: 'user'
            }
          ],
          through: {
            attributes: []
          }
        },
        {
          model: models.Attachment,
          attributes: ['id', 'name', 'path'],
          as: 'attachments',
          through: {
            attributes: []
          }
        }
      ],
      where,
      limit: 20,
      offset,
      logging: log => console.log(log)
    })

    let posts = data
    let user = ctx.query.user ? JSON.parse(ctx.query.user) : ctx.session.user

    if (user) {
      // лайкал пост или нет
      posts = data.map(post => {
        let liked = false
        if (size(post.likes.filter(like => like.user.id === user.id)) > 0) {
          liked = true
        }
        return Object.assign({}, post.toJSON(), {
          liked
        })
      })
    }

    ctx.body = posts
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

    const attachments = await pMap(postData.attachments, async attachment => {
      const result = await models.Attachment.create({
        name: attachment.key,
        path: attachment.url
      })
      return result
    })

    await created.addAttachments(attachments)

    const data = await models.Post.findOne({
      where: {
        id: created.id
      },
      attributes: ['id', 'title', 'content', 'created_at'],
      include: [{
        model: models.User,
        attributes: ['name', 'first_name', 'last_name', 'picture_small'],
        as: 'user'
      }, {
        model: models.Attachment,
        attributes: ['id', 'name', 'path'],
        as: 'attachments',
        through: {
          attributes: []
        }
      }]
    })
    ctx.body = data
  })

  router.bridge('/:id', [ initPostRoutes ], router => {
    // получени информации о посте
    router.get('/', async ctx => {
      const comments = await models.Comment.findAll({
        where: {
          is_blocked: 0,
          post_id: ctx.__.post.get('id')
        },
        include: [
          {
            model: models.User,
            attributes: ['id', 'name', 'first_name', 'last_name', 'picture_small'],
            as: 'user'
          }
        ]
      })

      ctx.body = {
        post: ctx.__.post,
        comments
      }
    })

    // удаление поста
    router.delete('/', async ctx => {
      if (!ctx.session.user || !ctx.session.user.id) throw new Error('Access denied')
      if (ctx.session.user.id !== ctx.__.post.user.id) throw new Error('Access denied')

      ctx.__.post.update({
        is_blocked: true
      })
      ctx.statusCode = 200
    })

    // список комментариев поста
    router.get('/comments', async ctx => {
      const data = await models.Comment.findAll({
        attributes: ['id', 'content'],
        where: {
          post_id: ctx.__.post.id
        },
        limit: 20,
        order: [['created_at', 'desc']]
      })

      ctx.body = data
    })

    // создание комментария
    router.post('/comment', async ctx => {
      try {
        if (!ctx.session.user || !ctx.session.user.id) throw new Error('Access denied')

        const { content } = ctx.request.body
        const created = await models.Comment.create({
          content,
          post_id: ctx.__.post.id,
          user_id: ctx.session.user.id
        })

        const data = await models.Comment.findOne({
          where: {
            id: created.id
          },
          attributes: [ 'id', 'post_id', 'content', 'created_at' ],
          include: [
            {
              model: models.User,
              attributes: [ 'name', 'first_name', 'last_name', 'picture_small' ],
              as: 'user'
            }
          ]
        })

        ctx.body = data
      } catch (e) {
        ctx.body = {}
      }
    })

    // поставить лайк посту
    router.post('/like', async ctx => {
      try {
        if (!ctx.session.user || !ctx.session.user.id) throw new Error('Access denied')

        const like = await models.Like.create({
          user_id: ctx.session.user.id
        })

        await ctx.__.post.addLike(like)

        const data = await models.Like.findOne({
          where: {
            id: like.id
          }
        })

        ctx.body = data
      } catch (e) {
        ctx.body = {
          status: 403,
          message: e.message
        }
      }
    })

    router.delete('/like', async ctx => {
      try {
        if (!ctx.session.user || !ctx.session.user.id) throw new Error('Access denied')
        const postId = ctx.params.id

        const data = await models.Post.findOne({
          where: {
            id: postId
          },
          include: [{
            attributes: ['id'],
            model: models.Like,
            as: 'likes',
            where: {
              user_id: ctx.session.user.id
            }
          }]
        })

        const like = data.likes[0]

        await models.Like.destroy({
          where: {
            id: like.id
          }
        })

        ctx.body = like
      } catch (e) {
        ctx.body = {
          status: 403,
          message: e.message
        }
      }
    })
  })
}
