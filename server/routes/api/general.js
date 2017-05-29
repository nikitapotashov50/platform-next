const services = require('../../services')
const { models } = require('../../models')

const mongoose = require('mongoose')
const { pick } = require('lodash')

module.exports = router => {
  router.post('/login', async ctx => {
    ctx.body = {
      ok: true
    }
  })

  // router.get('/refactor', async ctx => {
  //   let defaultProgram = await models.Program.findOne({
  //     where: {
  //       alias: { '$like': 'default' }
  //     }
  //   })

  //   let oldPrograms = await models.Program.findAll({
  //     where: {
  //       alias: { $in: [ 'ceh-23', 'mzs-17' ] }
  //     }
  //   })

  //   if (!defaultProgram) {
  //     defaultProgram = await models.Program.create({
  //       alias: 'default',
  //       title: 'Общая лента',
  //       is_enabled: true,
  //       start_at: moment('2015-01-01').format('YYYY-MM-DD HH:mm:ss'),
  //       finish_at: moment('2115-01-01').format('YYYY-MM-DD HH:mm:ss')
  //     })
  //   }

  //   await models.Program.create({
  //     alias: 'ceh-24',
  //     title: 'ЦЕХ 24',
  //     is_enabled: true,
  //     start_at: moment('2015-06-17').format('YYYY-MM-DD HH:mm:ss'),
  //     finish_at: moment('2015-08-17').format('YYYY-MM-DD HH:mm:ss')
  //   })

  //   await models.Program.create({
  //     alias: 'mzs-18',
  //     title: 'МЗС 18',
  //     is_enabled: true,
  //     start_at: moment('2015-06-20').format('YYYY-MM-DD HH:mm:ss'),
  //     finish_at: moment('2015-08-20').format('YYYY-MM-DD HH:mm:ss')
  //   })

  //   let users = await models.User.findAll()

  //   await Promise.all(users.map(user => {
  //     return new Promise(async (resolve, reject) => {
  //       await user.addPrograms([ defaultProgram ])
  //       resolve()
  //     })
  //   }))

  //   let programPosts = await models.Post.findAll({
  //     attributes: [ 'id' ],
  //     where: {
  //       '$Programs.id$': { $eq: null },
  //       created_at: { $lte: new Date('2017-05-01 00:00:00') }
  //     },
  //     include: [
  //       {
  //         model: models.Program
  //       }
  //     ],
  //     order: [
  //       [ 'created_at', 'desc' ]
  //     ]
  //   })

  //   await Promise.all(programPosts.map(async el => {
  //     return new Promise(async (resolve, reject) => {
  //       await el.addPrograms(oldPrograms)
  //       resolve()
  //     })
  //   }))

  //   let allPosts = await models.Post.findAll({
  //     attributes: [ 'id' ],
  //     where: {
  //       '$Programs.id$': { $eq: null },
  //       created_at: { $gte: new Date('2017-05-01 00:00:00') }
  //     },
  //     include: [
  //       {
  //         model: models.Program
  //       }
  //     ],
  //     order: [
  //       [ 'created_at', 'desc' ]
  //     ]
  //   })

  //   await Promise.all(allPosts.map(async el => {
  //     return new Promise(async (resolve, reject) => {
  //       await el.addPrograms([ defaultProgram ])
  //       resolve()
  //     })
  //   }))

  //   ctx.body = {
  //     status: 200,
  //     result: {
  //       defaultProgram,
  //       oldPrograms
  //     }
  //   }
  // })

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
          attributes: [ 'a', 'b', 'occupation' ],
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
      ctx.body = {
        user,
        goal: user.Goals,
        groups: user.Groups,
        subscriptions: user.Subscriptions,
        subscribers: user.Subscribers
      }
    }
  })

  router.get('/mongo_posts', async ctx => {
    let postData = [
      { title: 'Первый пост', content: 'Содержимое', type: 'user', user: 'bm-paperdoll', programs: [ 'ceh-23', 'default' ] },
      { title: 'Второй пост', content: 'Содержимое', type: 'user', user: 'bm-paperdoll', programs: [ 'ceh-23' ] },
      { title: 'Третий пост', content: 'Содержимое', type: 'user', user: 'bm-paperdoll', programs: [ 'mzs-17' ] }
    ]

    let types = await mongoose.models.PostTypes.find({})
    types = types.reduce((arr, item) => {
      arr[item.code] = item
      return arr
    }, {})

    let programs = await mongoose.models.Program.find({})
    programs = programs.reduce((arr, item) => {
      arr[item.alias] = item
      return arr
    }, {})

    postData.map(async el => {
      var post = new mongoose.models.Post({
        title: el.title,
        content: el.content,
        type: types[el.type]
      })

      post.programs = Object.values(pick(programs, el.programs) || {}) || []
      // ctx.log.info(Object.values(pick(programs, el.programs)))
      let user = await mongoose.models.Users.findOne({ name: el.user })

      post.userId = user

      await post.save()
    })

    let posts = await mongoose.models.Post.find({
      programs: { $in: [ 2 ] }
    })

    // let program = await mongoose.models.ProgramClass.find({
    //   program: 1
    // }).populate('program')

    ctx.body = {
      posts
    }
  })
}
