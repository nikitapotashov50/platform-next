const { models } = require('mongoose')
const { pick } = require('lodash')
const { keyObj, initMeRoutes } = require('../../../controllers/common')

const initPost = async (ctx, next) => {
  let post = await models.Post.findOne({ _id: ctx.params.id })
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
<<<<<<< HEAD
    let { programId = 3, authorIds, user, mode = 'new' } = ctx.query
=======
    let { programId = 3, authorIds, user } = ctx.query
>>>>>>> 4be3b2a01a129e6a936ce5befb5943ae3fb39761

    let params = {}
    params.programs = { $in: [ Number(programId) ] }
    if (authorIds) params.userId = { $in: authorIds.split(',') }

    let userId = ctx.session.user ? ctx.session.user._id : (user || null)

    let options = pick(ctx.query, [ 'limit', 'offset' ])

<<<<<<< HEAD
    let result = {}
    let total = null
    let posts = []

    if (mode === 'new') {
      result = await models.Post.getList(params, options)
      posts = result.posts
      total = result.total
    } if (mode === 'actual') posts = await models.Post.getActual(params, options)

=======
    let { total, posts } = await models.Post.getList(params, options)
>>>>>>> 4be3b2a01a129e6a936ce5befb5943ae3fb39761
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

<<<<<<< HEAD
    let replyStatuses = models.TaskVerificationStatus.getIdObject()

    replies = replies.reduce((obj, reply) => {
      obj[reply.postId] = {
        _id: reply.taskId._id,
        title: reply.taskId.title,
        type: reply.replyTypeId.code,
        status: replyStatuses[reply.status[0].status],
        data: reply.specific ? reply.specific.item : null
      }
=======
    replies = replies.reduce((obj, reply) => {
      obj[reply.postId] = { type: reply.replyTypeId.code, data: reply.specific ? reply.specific.item : null }
>>>>>>> 4be3b2a01a129e6a936ce5befb5943ae3fb39761
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
      post.userId = user._id

      ctx.body = {
        status: 200,
        result: {
          posts: post,
          users: keyObj(users)
        }
      }
    } catch (e) {
      ctx.body = {
        status: 500,
        message: e.message
      }
    }
  })

  router.bridge('/:id', [ initPost ], router => {
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
