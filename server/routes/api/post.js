const pMap = require('p-map')
const { has, uniq } = require('lodash')
const { models, cached, orm } = require('../../models')

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
  let { where, offset, limit = 7 } = params

  let include = [
    {
      as: 'comments',
      model: models.Comment,
      attributes: [ 'id' ]
    },
    {
      required: false,
      duplicating: false,
      as: 'likes',
      attributes: [ 'id' ],
      model: models.Like,
      through: {
        attributes: []
      }
    },
    {
      required: false,
      duplicating: false,
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

  const data = await cached.Post.findAll({
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
    subquery: false
  })

  return data
}

const getUsersByIds = async ids => {
  let result = await cached.User.findAll({
    where: {
      id: { $in: ids }
    },
    attributes: [
      'id', 'picture_small', 'name', 'first_name', 'last_name',
      [ orm.col('Goals.occupation'), 'occupation' ]
    ],
    include: [
      {
        attributes: [],
        model: models.Goal,
        where: { is_closed: false }
      }
    ]
  })

  return result
}

module.exports = router => {
  router.get('/comments', async ctx => {
    console.log(ctx.query)
    let idArray = ctx.query.idArray || ''

    let data = await models.Comment.findAll({
      where: {
        id: { $in: idArray.split(',') }
      }
    })

    ctx.body = {
      status: 200,
      result: {
        comments: data.reduce((acc, item) => {
          acc[item.id] = item
          return acc
        }, {})
      }
    }
  })
  // список всех постов
  router.get('/', async ctx => {
    const offset = Number(ctx.query.offset) || 0
    const programId = Number(ctx.query.programId) || null
    let authors = has(ctx.query, 'by_author_id') ? ctx.query.by_author_id.split(',') : null

    // не показывать удаленные посты
    let where = {
      is_blocked: false
    }

    // посты конкретного юзера
    if (authors) where.user_id = { $in: authors }

    // посты по программе
    if (programId) where.programId = programId

    let posts = await getPostList({ where, offset })

    let postIds = []
    let userIds = []
    let commentIds = []

    let realPosts = posts.map(el => {
      postIds.push(el.id)
      userIds.push(el.user_id)

      if (el.comments) {
        el.comments.slice(-3).map(el => { commentIds.push(el.id) })
      }

      return el
    })

    let comments = await cached.Comment.findAll({
      attributes: [ 'id', 'content', 'user_id', 'created_at' ],
      where: { id: { $in: commentIds } }
    })

    comments = comments.reduce((acc, item) => {
      acc[item.id] = item
      userIds.push(item.user_id)
      return acc
    }, {})

    let usersArr = await getUsersByIds(uniq(userIds))
    let users = usersArr.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})

    ctx.body = {
      status: 200,
      result: {
        comments,
        posts: realPosts,
        users
      }
    }
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
      attributes: [ 'id', 'title', 'content', 'created_at', 'user_id' ],
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

    let users = await getUsersByIds([ ctx.session.user.id ])
    let user = users.shift()

    ctx.body = {
      status: 200,
      result: {
        posts: data,
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

        ctx.body = {
          status: 200,
          result: {
            comment: created
          }
        }
      } catch (e) {
        ctx.body = {
          status: 500
        }
      }
    })

    router.delete('/comment/:commentId', async ctx => {
      console.log('asdasdasdasdasdasdasd', ctx.params)
      try {
        if (!ctx.session.user || !ctx.session.user.id) throw new Error('Access denied')

        let comment = await models.Comment.findOne({
          where: { id: ctx.params.commentId }
        })

        if (!comment) throw new Error('Comment not exists')
        if (comment.user_id !== ctx.session.user.id) throw new Error('Access denied')

        await comment.destroy()

        ctx.body = {
          status: 200,
          result: { data: 'ok' }
        }
      } catch (e) {
        console.log(e)
        ctx.body = {
          status: 500
        }
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
