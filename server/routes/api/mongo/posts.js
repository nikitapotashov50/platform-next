const { models } = require('mongoose')
const { pick } = require('lodash')
const { keyObj } = require('../../../controllers/common')

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

module.exports = router => {
  router.get('/', async ctx => {
    let { programId = 3, authorIds, user } = ctx.query

    let params = {}
    params.programs = { $in: [ Number(programId) ] }
    if (authorIds) params.userId = { $in: authorIds.split(',') }

    let userId = ctx.session.user ? ctx.session.user._id : (user || null)

    let options = pick(ctx.query, [ 'limit', 'offset' ])

    let { total, posts } = await models.Post.getList(params, options)
    let comments = await models.Comment.getForPosts(posts, { limit: 3, reversed: true })

    let userIds = []
    let postIds = []

    // вытаскиваем пользователя из поста
    posts.map(post => {
      postIds.push(post._id)
      userIds.push(post.userId)
    })

    // достаем список постов, которые понравились
    let liked = []
    if (userId) {
      liked = await models.Like.find({
        userId: userId,
        enabled: true,
        'target.model': 'Post',
        'target.item': { $in: postIds }
      })
    }

    // вытаскиваем пользователей из комментов
    Object.values(comments).map(pComments => {
      pComments.map(comment => { userIds.push(comment.userId) })
    })

    let users = await models.Users.getShortInfo(userIds)

    ctx.body = {
      status: 200,
      result: {
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

    router.bridge('/like', router => {
      router.post('/', async ctx => {
        try {
          ctx.log.info(ctx.session.user._id)
          if (!ctx.session.user || !ctx.session.user._id) throw new Error('Access denied')
          let user = await models.Users.findOne({ _id: ctx.session.user._id })
          if (!user) throw new Error('Access denied')
          ctx.log.info(`user id is ${user._id}`)
          await ctx.__.post.addLike(user._id)

          ctx.body = { status: 200 }
        } catch (e) {
          ctx.body = {
            status: 500,
            message: e
          }
        }
      })

      router.delete('/', async ctx => {
        try {
          if (!ctx.session.user || !ctx.session.user._id) throw new Error('Access denied')
          let user = await models.Users.findOne({ _id: ctx.session.user._id })
          if (!user) throw new Error('Access denied')

          await ctx.__.post.removeLike(user._id)

          ctx.body = { status: 200 }
        } catch (e) {
          ctx.body = {
            status: 500,
            message: e
          }
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
