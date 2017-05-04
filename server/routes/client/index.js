module.exports = router => {
  router.get('/posts/:id', async ctx => {
    await ctx.__next.render(ctx.req, ctx.res, '/posts', ctx.params)
  })

  router.get('*', async ctx => {
    await ctx.__next.getRequestHandler()(ctx.req, ctx.res)
  })
}
