const pMap = require('p-map')
const { has, uniq, pick, union } = require('lodash')
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
  let { where, offset, limit = 7 } = params

  let include = [
    {
      required: false,
      as: 'comments',
      model: models.Comment,
      attributes: [ 'id' ]
    },
    {
      required: false,
      as: 'likes',
      attributes: [ 'id', 'user_id' ],
      model: models.Like,
      through: {
        attributes: []
      }
    },
    {
      required: false,
      model: models.Attachment,
      attributes: [ 'id', 'name', 'path', 'mime', 'type' ],
      as: 'attachments',
      through: {
        attributes: []
      }
    }
  ]

  let rawPostIdData = await models.Post.findAndCountAll({
    where,
    attributes: [ 'id' ],
    include: [
      {
        duplicating: false,
        required: true,
        model: models.Program,
        attributes: [],
        through: {
          attributes: []
        }
      }
    ],
    limit,
    offset: offset * limit,
    order: [
      [ 'created_at', 'desc' ]
    ]
  })

  let posts = []
  if (rawPostIdData.rows.length > 0) {
    posts = await models.Post.findAll({
      attributes: [ 'id', 'title', 'created_at', 'user_id', 'content' ],
      where: {
        id: { $in: rawPostIdData.rows.map(el => el.id) }
      },
      include,
      order: [
        [ 'created_at', 'desc' ]
      ]
    })
  }

  return { posts, total: rawPostIdData.count }
}

const getCommentsByIds = ids => {
  return models.Comment.findAll({
    attributes: [ 'id', 'content', 'user_id', 'created_at' ],
    where: { id: { $in: ids } }
  })
}

const getUsersByIds = async ids => {
  let result = await models.User.findAll({
    where: {
      id: { $in: ids },
      $or: {
        id: { $in: ids },
        '$Goals.is_closed$': false
      }
    },
    attributes: [
      'id', 'picture_small', 'name', 'first_name', 'last_name',
      [ orm.col('Goals.occupation'), 'occupation' ]
    ],
    include: [
      {
        reuired: false,
        attributes: [],
        model: models.Goal
      }
    ]
  })

  return result
}

module.exports = router => {
  router.get('/comments', async ctx => {
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
    const programId = has(ctx.query, 'programId') ? Number(ctx.query.programId) || null : null
    const postsId = has(ctx.query, 'by_post_id') ? ctx.query.by_post_id.split(',') : null
    const authors = has(ctx.query, 'by_author_id') ? ctx.query.by_author_id.split(',') : null

    const userId = ctx.session.user ? ctx.session.user.id : (Number(ctx.query.user) || null)

    // не показывать удаленные посты
    let where = { is_blocked: false }

    // посты конкретного юзера
    if (authors) where.user_id = { $in: authors }

    // посты по программе
    if (programId) where['$Programs.id$'] = programId

    // может быть мы хотим выбрать конкретный пост
    if (postsId) where.id = { $in: postsId }

    let { total, posts } = await getPostList({ where, offset })

    let liked = []
    let userIds = []
    let commentIds = []

    posts = posts.map(el => {
      userIds.push(el.user_id)

      if (el.comments) el.comments.slice(-3).map(comEl => { commentIds.push(comEl.id) })
      if (el.likes && userId) union(liked, el.likes.filter(like => userId === like.user_id).map(() => el.id))

      return Object.assign(
        {},
        pick(el, [ 'id', 'title', 'content', 'created_at', 'attachments', 'comments', 'user_id' ]),
        { 'likes_count': (el.likes || []).length }
      )
    })

    let comments = []
    if (commentIds.length > 0) comments = await getCommentsByIds(commentIds)
    comments = comments.reduce((acc, item) => {
      acc[item.id] = item
      userIds.push(item.user_id)
      return acc
    }, {})

    let users = []
    if (userIds.length > 0) users = await getUsersByIds(uniq(userIds))
    users = users.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})

    userIds = null
    commentIds = null

    ctx.body = {
      status: 200,
      result: { users, posts, liked, comments, total }
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
      if (attachment.type === 'video') {
        const result = await models.Attachment.create({
          path: attachment.url,
          type: 'video'
        })
        return result
      }

      const result = await models.Attachment.create({
        name: attachment.key,
        path: attachment.url,
        mime: attachment.mime
      })
      return result
    })

    await created.addAttachments(attachments)

    if (postData.program) {
      let program = await models.Program.findOne({
        where: { id: Number(postData.program) }
      })

      if (program) await created.addPrograms([ program ])
    }

    const data = await models.Post.findOne({
      where: {
        id: created.id
      },
      attributes: [ 'id', 'title', 'content', 'created_at', 'user_id' ],
      include: [
        {
          model: models.Attachment,
          attributes: ['id', 'name', 'path', 'mime', 'type'],
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

    router.put('/', async ctx => {
      if (!ctx.session.user || !ctx.session.user.id) throw new Error('Access denied')
      if (ctx.session.user.id !== ctx.__.post.user.id) throw new Error('Access denied')

      const { title, content } = ctx.request.body

      await ctx.__.post.update({
        title,
        content
      })

      ctx.statusCode = 200
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
