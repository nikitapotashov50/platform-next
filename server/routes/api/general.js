const services = require('../../services')
const { models } = require('../../models')

module.exports = router => {
  router.post('/login', async ctx => {
    ctx.body = {
      ok: true
    }
  })

  router.get('/version', services.general.getAPIVersionService)

  router.get('/ratings', async ctx => {})

  router.get('/admin/programs/list', async ctx => {
    try {
      let programsRaw = await models.Program.findAll()

      ctx.body = {
        programs: programsRaw
      }
    } catch (e) {
      ctx.body = {
        status: 500,
        message: e.message
      }
    }
  })

  router.get('/user/:username', async ctx => {
    let user = await models.User.findOne({
      where: {
        name: ctx.params.username
      },
      include: [
        {
          required: false,
          model: models.Goal,
          where: {
            is_closed: 0
          }
        },
        {
          required: false,
          as: 'Groups',
          model: models.Group,
          where: { is_blocked: 0 },
          attributes: [ 'title', 'id' ],
          through: {
            attributes: []
          }
        },
        {
          required: false,
          as: 'Subscriptions',
          model: models.User,
          attributes: [ 'name', 'picture_small', 'last_name', 'first_name', 'id' ],
          through: {
            attributes: []
          }
        },
        {
          required: false,
          as: 'Subscribers',
          model: models.User,
          attributes: [ 'name', 'picture_small', 'last_name', 'first_name', 'id' ],
          through: {
            attributes: []
          }
        }
      ]
    })

    if (!user) {
      ctx.body = {
        status: 404
      }
    } else {
      let groups = user.get('Groups')
      let subscriptions = user.get('Subscriptions')
      let subscribers = user.get('Subscribers')
      let goal = user.get('Goals')

      ctx.body = {
        user,
        goal,
        groups,
        subscriptions,
        subscribers
      }
    }
  })
}
