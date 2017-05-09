module.exports = router => {
  router.get('/reports', async ctx => {
    await ctx.__next.render(ctx.req, ctx.res, '/')
  })

  router.get('*', async ctx => {
    await ctx.__next.getRequestHandler()(ctx.req, ctx.res)
  })
}
