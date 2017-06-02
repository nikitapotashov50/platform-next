module.exports = router => {
  router.get('/reports', async ctx => {
    await ctx.__next.render(ctx.req, ctx.res, '/')
  })

  router.bridge('/@:username', router => {
    router.get('/', async ctx => {
      await ctx.__next.render(ctx.req, ctx.res, '/user', Object.assign({}, ctx.params, ctx.query))
    })
  })

  router.get('/feed/:tab', async ctx => {
    await ctx.__next.render(ctx.req, ctx.res, '/', Object.assign({}, ctx.params, ctx.query))
  })

  router.bridge('/posts', router => {
    router.get('/:postId', async ctx => {
      await ctx.__next.render(ctx.req, ctx.res, '/posts', Object.assign({}, ctx.params, ctx.query))
    })
  })

  router.bridge('/ratings', router => {
    router.bridge('/:tab', router => {
      router.get('/', async ctx => {
        await ctx.__next.render(ctx.req, ctx.res, '/ratings', Object.assign({}, ctx.params, ctx.query))
      })
      router.get('/:id', async ctx => {
        await ctx.__next.render(ctx.req, ctx.res, '/ratings', Object.assign({}, ctx.params, ctx.query))
      })
    })
  })

  router.bridge('/feedback', router => {
    router.get('/:type', async ctx => {
      await ctx.__next.render(ctx.req, ctx.res, '/feedback', Object.assign({}, ctx.params, ctx.query))
    })
  })

  router.bridge('/tasks', router => {
    router.get('/:id', async ctx => {
      await ctx.__next.render(ctx.req, ctx.res, '/tasks/task', Object.assign({}, ctx.params, ctx.query))
    })
  })

  router.bridge('/admin', router => {
    router.get('/users/:userId', async ctx => {
      await ctx.__next.render(ctx.req, ctx.res, '/admin/users', Object.assign({}, ctx.params, ctx.query))
    })

    router.bridge('/feedback', router => {
      router.get('/:type', async ctx => {
        if ([ 'platform', 'class', 'program', 'coach' ].indexOf(ctx.params.type) === -1) console.log('404')

        await ctx.__next.render(ctx.req, ctx.res, '/admin/feedback', Object.assign({}, ctx.params, ctx.query))
      })
    })
  })

  let initSettings = async (ctx, next) => {
    if (!ctx.params.tab) ctx.params.tab = 'main'
    await next()
  }

  router.bridge('/account/settings', [ initSettings ], router => {
    router.get('/:tab', async ctx => {
      let page = '/account/settings'
      if (ctx.params.tab === 'goal') page = '/account/settings_goal'

      await ctx.__next.render(ctx.req, ctx.res, page, Object.assign({}, ctx.params, ctx.query))
    })
  })

  router.get('/chat/:chatId', async ctx => {
    await ctx.__next.render(ctx.req, ctx.res, '/chat', Object.assign({}, ctx.params, ctx.query))
  })

  router.get('*', async ctx => {
    await ctx.__next.getRequestHandler()(ctx.req, ctx.res)
  })
}
