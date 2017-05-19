const pMap = require('p-map')
const { has, pick, uniq } = require('lodash')
const { models, orm } = require('../../models')

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

const getPostList = async (params) => {
  let { where, offset, limit = 5 } = params

  let include = [
    {
      as: 'comments',
      attributes: [ 'id', 'content', 'user_id' ],
      model: models.Comment
    },
    {
      as: 'likes',
      attributes: [ 'id' ],
      model: models.Like,
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
  ]

  if (where.programId) {
    let programId = where.programId
    delete where.programId

    include.push({
      required: true,
      attributes: [],
      where: { id: programId },
      model: models.Program,
      through: {
        attributes: []
      }
    })
  }

  const data = await models.Post.findAll({
    attributes: [
      'id', 'title', 'content', 'created_at', 'user_id'
    ],
    order: [
      [ 'created_at', 'desc' ]
    ],
    include,
    where,
    limit,
    offset: offset * limit,
    group: [ 'id' ]
  })

  return data
}

const getUsersByIds = async ids => {
  let result = await models.User.findAll({
    where: {
      id: { $in: ids }
    },
    attributes: [
      'id', 'picture_small', 'name', 'first_name', 'last_name',
      [ orm.col('Goals.occupation'), 'occupation' ]
    ],
    include: [
      {
        attributes: [ 'occupation' ],
        model: models.Goal,
        where: { is_closed: false }
      }
    ]
  })

  return result
}

module.exports = router => {
  // список всех постов
  router.get('/', async ctx => {
    const offset = Number(ctx.query.offset) || 0
    const programId = Number(ctx.query.programId) || null

    let authors = has(ctx.query, 'by_author_id') ? ctx.query.by_author_id.split(',') : null

    // не показывать удаленные посты
    let where = { is_blocked: false }

    // посты конкретного юзера
    if (authors) where.user_id = { $in: authors }

    // посты по программе
    if (programId) where.programId = programId

    let posts = await getPostList({ where, offset })

    let postIds = []
    let userIds = []

    let realPosts = posts.map(el => {
      postIds.push(el.id)
      userIds.push(el.user_id)

      if (el.comments) {
        el.comments.map(el => {
          userIds.push(el.user_id)
        })
      }

      return Object.assign(
        {},
        pick(el, [ 'title', 'content', 'created_at', 'user_id', 'id', 'comments', 'likes' ]),
        {
          likes_count: el.likes.length,
          comments_count: el.comments.length
        }
      )
    })

    let usersArr = await getUsersByIds(uniq(userIds))

    let users = usersArr.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})

    ctx.body = {
      status: 200,
      result: {
        posts: realPosts,
        users
      }
    }
  })

  // создание поста
  router.post('/', async ctx => {
    let postData = ctx.request.body
    const program = postData.program
    delete postData.program

    const created = await models.Post.create({
      title: postData.title,
      content: postData.content,
      type: 'user',
      user_id: ctx.session.user.id
    })

    if (program) {
      let programEntry = await models.Program.findOne({
        where: { id: program }
      })

      if (programEntry) await created.addPrograms([ programEntry ])
    }

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
      include: [
        {
          model: models.Attachment,
          attributes: ['id', 'name', 'path'],
          as: 'attachments',
          through: {
            attributes: []
          }
        }
      ]
    })

    let user = await getUsersByIds([ ctx.session.user.id ])

    ctx.body = {
      status: 200,
      result: {
        post: data,
        users: { [user.id]: user }
      }
    }
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
