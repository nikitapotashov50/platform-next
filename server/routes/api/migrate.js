const migrations = require('../../controllers/migrations')

module.exports = router => {
  router.get('/', async ctx => {
    await migrations.migrateCities(ctx)
    await migrations.migrateUsers(ctx)
    await migrations.migrateSubscriptions(ctx)
    await migrations.migratePosts(ctx)
    await migrations.migrateGroups(ctx)
  })

  router.get('/cities', async ctx => {
    await migrations.migrateCities(ctx)

    ctx.body = {}
  })

  router.get('/users', async ctx => {
    await migrations.migrateUsers(ctx)

    ctx.body = {}
  })

  router.get('/user_subscriptions', async ctx => {
    await migrations.migrateSubscriptions(ctx)

    ctx.body = {}
  })

  router.get('/posts', async ctx => {
    await migrations.migratePosts(ctx)

    ctx.body = {}
  })

  router.get('/groups', async ctx => {
    await migrations.migrateGroups(ctx)

    ctx.body = {}
  })
}
