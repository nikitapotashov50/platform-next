const { models } = require('mongoose')
const { pick, isUndefined } = require('lodash')
const { keyObj, initMeRoutes } = require('../../../controllers/common')

const initPost = async (ctx, next) => {
  let [ post ] = await models.Post.find({ _id: ctx.params.id }).limit(1)
  if (post) {
    ctx.__.post = post
    await next()
  } else {
    ctx.body = {
      status: 404,
      message: 'Post not found'
    }
  }
}

const getLiked = (postIds, userId) => {
  return new Promise(async (resolve, reject) => {
    if (!userId) resolve([])
    else {
      let liked = await models.Like.find({
        userId: userId,
        enabled: true,
        'target.model': 'Post',
        'target.item': { $in: postIds }
      }).lean()

      resolve(liked)
    }
  })
}

module.exports = router => {
  router.get('/', async ctx => {
    let { programId = 3, authorIds, user, mode = 'new' } = ctx.query

    let params = {}
    params.programs = { $in: [ Number(programId) ] }

    if (!isUndefined(authorIds)) params.userId = { $in: (!authorIds ? [] : authorIds.split(',')) }

    let userId = ctx.session.user ? ctx.session.user._id : (user || null)

    let options = pick(ctx.query, [ 'limit', 'offset' ])

    let result = {}
    let total = null
    let posts = []

    if (mode === 'actual') posts = await models.Post.getActual(params, options)
    else {
      result = await models.Post.getList(params, options)
      posts = result.posts
      total = result.total
    }

    let comments = await models.Comment.getForPosts(posts, { limit: 3, reversed: true })

    let userIds = []
    let postIds = []

    // вытаскиваем пользователя из поста
    posts.map(post => {
      postIds.push(post._id)
      userIds.push(post.userId)
    })

    // вытаскиваем пользователей из комментов
    Object.values(comments).map(pComments => {
      pComments.map(comment => { userIds.push(comment.userId) })
    })

    let [ replies, liked, users ] = await Promise.all([
      models.TaskReply.getByPostIds(postIds),
      getLiked(postIds, userId),
      models.Users.getShortInfo(userIds)
    ])

    let replyStatuses = models.TaskVerificationStatus.getIdObject()

    replies = replies.reduce((obj, reply) => {
      obj[reply.postId] = {
        _id: reply.taskId._id,
        created: reply.created,
        finish_at: reply.taskId.finish_at,
        title: reply.taskId.title,
        type: reply.replyTypeId.code,
        status: replyStatuses[reply.status[0] ? reply.status[0].status : 'pending'],
        data: reply.specific ? reply.specific.item : null
      }
      return obj
    }, {})

    ctx.body = {
      status: 200,
      result: {
        replies,
        posts,
        total,
        comments,
        users: keyObj(users),
        liked: liked.map(el => el.target.item)
      }
    }
  })

  router.post('/', async ctx => {
    try {
      if (!ctx.session.user || !ctx.session.user._id) throw new Error('Access denied')
      let user = await models.Users.findOne({ _id: ctx.session.user._id })
      if (!user) throw new Error('Access denied')

      const postData = ctx.request.body

      const post = await models.Post.addPost(postData, { user })
      const users = await models.Users.getShortInfo([ user._id ])
      const attachments = await models.Attachment.find({ _id: { $in: post.attachments } })

      post.userId = user._id
      post.attachments = attachments

      ctx.body = {
        status: 200,
        result: {
          posts: post,
          users: keyObj(users)
        }
      }
    } catch (e) {
      ctx.body = { status: 500, message: e.message }
    }
  })

  router.bridge('/:id', [ initPost ], router => {
    router.delete('/', async ctx => {
      try {
        // ctx.log.info(JSON.stringify(ctx.__.post), ctx.session)
        if (!ctx.session.uid) throw new Error('Access denied')
        if (ctx.__.post._doc.userId.toString() !== ctx.session.uid) throw new Error('Access denied')

        await ctx.__.post.block()

        ctx.body = { status: 200, result: { id: ctx.__.post._id } }
      } catch (e) {
        ctx.log.info(e)
        ctx.body = { status: 403, message: e }
      }
    })

    router.put('/', async ctx => {
      try {
        // ctx.log.info(JSON.stringify(ctx.__.post), ctx.session)
        if (!ctx.session.uid) throw new Error('Access denied')
        if (ctx.__.post._doc.userId.toString() !== ctx.session.uid) throw new Error('Access denied')
        if (!ctx.request.body) throw new Error('no body found')

        await ctx.__.post.updatePost(pick(ctx.request.body, [ 'title', 'content' ]))

        ctx.body = { status: 200, result: {} }
      } catch (e) {
        ctx.log.info(e)
        ctx.body = { status: 403, message: e }
      }
    })

    router.get('/comments', async ctx => {
      let { offset, limit, reversed } = ctx.query
      try {
        let comments = await ctx.__.post.getComments(offset, limit, reversed)
        ctx.body = {
          status: 200,
          result: { comments }
        }
      } catch (e) {
        ctx.body = { status: 500 }
      }
    })

    router.bridge('/like', [ initMeRoutes ], router => {
      router.post('/', async ctx => {
        try {
          await ctx.__.post.addLike(ctx.__.me._id)

          ctx.body = { status: 200 }
        } catch (e) {
          ctx.body = { status: 500, message: e }
        }
      })

      router.delete('/', async ctx => {
        try {
          await ctx.__.post.removeLike(ctx.__.me._id)

          ctx.body = { status: 200 }
        } catch (e) {
          ctx.body = { status: 500, message: e }
        }
      })
    })

    router.post('/comments', async ctx => {
      try {
        if (!ctx.session.user || !ctx.session.user._id) throw new Error('Access denied')
        let user = await models.Users.findOne({ _id: ctx.session.user._id })
        if (!user) throw new Error('Access denied')

        const { content } = ctx.request.body

        let comment = await ctx.__.post.addComment(content, user)
        let users = await models.Users.getShortInfo([ user._id ])
        comment.userId = user._id

        ctx.body = {
          status: 200,
          result: {
            comment,
            users: keyObj(users)
          }
        }
      } catch (e) {
        ctx.log.info(e)
        ctx.body = {
          status: 500
        }
      }
    })

    router.delete('/comments/:commentId', async ctx => {
      try {
        if (!ctx.session.user || !ctx.session.user._id) throw new Error('Access denied')
        let user = models.Users.findOne({ _id: ctx.session.user._id })
        if (!user) throw new Error('Access denied')

        await ctx.__.post.removeComment(ctx.params.commentId, user)

        ctx.body = { status: 200 }
      } catch (e) {
        ctx.body = {
          status: 500,
          message: e.message
        }
      }
    })
  })
}
