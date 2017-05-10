module.exports = router => {
  router.get('/posts/:id', async ctx => {
    await ctx.__next.render(ctx.req, ctx.res, '/posts', ctx.params)
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

  router.get('*', async ctx => {
    await ctx.__next.getRequestHandler()(ctx.req, ctx.res)
  })
}
