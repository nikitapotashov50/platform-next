const moment = require('moment')
const services = require('../../services')
const { models, cached } = require('../../models')

module.exports = router => {
  router.post('/login', async ctx => {
    ctx.body = {
      ok: true
    }
  })

  router.get('/refactor', async ctx => {
    let defaultProgram = await models.Program.findOne({
      where: {
        alias: 'defaut'
      }
    })

    if (!defaultProgram) {
      defaultProgram = await models.Program.create({
        alias: 'default',
        title: 'БМ Платформа',
        is_enabled: true,
        start_at: moment('2015-01-01').format('YYYY-MM-DD HH:mm:ss'),
        finish_at: moment('2115-01-01').format('YYYY-MM-DD HH:mm:ss')
      })
    }

    let programPosts = await models.Post.findAll({
      attributes: [ 'id' ],
      where: {
        '$Programs.id$': { $eq: null }
      },
      include: [
        {
          model: models.Program
        }
      ],
      order: [
        [ 'created_at', 'desc' ]
      ]
    })

    await Promise.all(programPosts.map(async el => {
      await new Promise((resolve, reject) => {
        el.addPrograms([ defaultProgram ])
      })
    }))

    ctx.body = {
      status: 200,
      result: {
        defaultProgram,
        programPosts
      }
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
    let user = await cached.User.findOne({
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
      let groups = user.Groups
      let subscriptions = user.Subscriptions
      let subscribers = user.Subscribers
      let goal = user.Goals

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
