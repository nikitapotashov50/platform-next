module.exports = router => {
  router.get('/reports', async ctx => {
    await ctx.__next.render(ctx.req, ctx.res, '/')
  })

  router.bridge('/@bm-:username', router => {
    router.get('/', async ctx => {
      let username = 'bm-' + ctx.params.username
      await ctx.__next.render(ctx.req, ctx.res, '/user', Object.assign({}, ctx.params, { username }))
    })

    router.get('/settings', async ctx => {
      let username = 'bm-' + ctx.params.username
      await ctx.__next.render(ctx.req, ctx.res, '/user/settings', Object.assign({}, ctx.params, { username }))
    })
  })

  router.bridge('/admin', router => {
    router.bridge('/feedback', router => {
      router.get('/', async ctx => {
        await ctx.__next.render(ctx.req, ctx.res, '/admin/feedback', Object.assign({}, ctx.params, ctx.query, { type: 'program' }))
      })

      router.get('/:type', async ctx => {
        if ([ 'platform', 'coach', 'program' ].indexOf(ctx.params.type) === -1) console.log('404')

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
      await ctx.__next.render(ctx.req, ctx.res, '/account/settings', Object.assign({}, ctx.params, ctx.query))
    })
  })

  router.get('*', async ctx => {
    await ctx.__next.getRequestHandler()(ctx.req, ctx.res)
  })
}
