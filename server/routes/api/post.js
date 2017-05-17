const { size, has } = require('lodash')
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

    // не показывать удаленные посты
    let where = {
      is_blocked: false
    }

    // посты конкретного юзера
    if (has(ctx.query, 'byUserId')) {
      where = Object.assign({}, where, {
        user_id: ctx.query.byUserId
      })
    }

    const data = await models.Post.findAll({
      attributes: ['id', 'title', 'content', 'user_id', 'created_at'],
      order: [['created_at', 'desc']],
      include: [{
        model: models.User,
        attributes: ['id', 'name', 'first_name', 'last_name', 'picture_small'],
        as: 'user'
      }, {
        model: models.Comment,
        attributes: ['id', 'content', 'created_at'],
        as: 'comments',
        include: [{
          model: models.User,
          attributes: ['id', 'name', 'first_name', 'last_name', 'picture_small'],
          as: 'user'
        }]
      }, {
        model: models.Like,
        as: 'likes',
        attributes: ['id', 'created_at'],
        include: [{
          model: models.User,
          attributes: ['id', 'name', 'first_name', 'last_name', 'picture_small'],
          as: 'user'
        }]
      }],
      where,
      limit: 20,
      offset
    })

    let posts = data
    let user = ctx.query.user ? JSON.parse(ctx.query.user) : ctx.session.user

    // лайкал пост или нет
    if (user) {
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
