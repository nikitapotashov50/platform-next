const { pick } = require('lodash')
const { models, cached } = require('../../models')

const { getBMAccessToken, getMyInfo, isUserAuthOnBM, getBMRecovery, getBMAccessTokenCredentialsOnly, getBMSignUp } = require('../../controllers/authController')

const getUser = async email => {
  let rawUser = await models.User.findOne({
    attributes: [ 'id', 'name', 'first_name', 'last_name', 'picture_small' ],
    where: { email },
    include: [
      {
        required: false,
        model: models.Program,
        attributes: [ 'id', 'title', 'alias', 'start_at', 'finish_at' ],
        through: {
          attributes: [ 'is_activated' ]
        }
      },
      {
        required: false,
        model: models.User,
        as: 'Subscriptions',
        attributes: [ 'id', 'name' ],
        through: {
          attributes: []
        }
      },
      {
        required: false,
        model: models.User,
        as: 'BlackList',
        attributes: [ 'id', 'name' ],
        through: {
          attributes: []
        }
      }
    ]
  })

  if (!rawUser) return null

  return {
    user: pick(rawUser, [ 'id', 'last_name', 'first_name', 'picture_small', 'name' ]),
    programs: rawUser.get('Programs'),
    blackList: rawUser.get('BlackList'),
    subscriptions: rawUser.get('Subscriptions')
  }
}

const createUserBasedOnBM = async accessToken => {
  let BMInfo = await getMyInfo(accessToken)
  let user = await models.User.create({
    first_name: BMInfo.firstName,
    last_name: BMInfo.lastName,
    birthday: BMInfo.birthDate,
    email: BMInfo.email,
    name: BMInfo.userId,
    picture_small: 'http://static.molodost.bz/thumb/160_160_2/img/avatars/' + BMInfo.avatar
  })

  return { user }
}

module.exports = router => {
  router.get('/restore', async ctx => {
    let email = unescape(ctx.cookies.get('molodost_user'))
    let hash = ctx.cookies.get('molodost_hash')
    let BMAccess, user

    if (hash && email) {
      BMAccess = await isUserAuthOnBM(email, hash, ctx.request.headers['user-agent'])

      if (BMAccess) {
        user = await getUser(email)
        if (!user) user = await createUserBasedOnBM(BMAccess)
      }
      ctx.session = user
    }
    ctx.body = user
  })

  router.post('/logout', ctx => {
    ctx.session = {}
    ctx.body = {
      status: 200
    }
  })

  router.post('/recover', async ctx => {
    try {
      const BMAccess = await getBMAccessTokenCredentialsOnly()

      if (!BMAccess || !BMAccess.access_token) throw new Error('no token')

      let { email } = ctx.request.body

      await getBMRecovery(email, BMAccess.access_token)

      ctx.body = {
        status: 200
      }
    } catch (e) {
      ctx.body = {
        status: 500,
        message: e.message
      }
    }
  })

  router.post('/register', async ctx => {
    try {
      let BMAccess = await getBMAccessTokenCredentialsOnly()

      if (!BMAccess || !BMAccess.access_token) throw new Error('no token')

      let { email, firstName, lastName } = ctx.request.body

      const getBMNewUser = await getBMSignUp(email, firstName, lastName, BMAccess.access_token)

      if (!getBMNewUser.status || getBMNewUser.status !== 'success') {
        ctx.body = {
          status: 400,
          message: getBMNewUser.description,
          result: {
            errors: Object.keys(getBMNewUser.err_data)
          }
        }
      } else {
        ctx.body = { status: 200 }
      }
    } catch (e) {
      ctx.body = {
        status: 500,
        message: e.message
      }
    }
  })

  router.post('/login', async (ctx, next) => {
    let { email, password } = ctx.request.body

    try {
      let BMAccess = await getBMAccessToken(email, password)
      if (!BMAccess.access_token) throw new Error('No user account found on molodost.bz')

      // Проверяем наличие юзера у нас в базе данных
      let dbUser = await getUser(email)

      if (!dbUser && BMAccess.access_token) {
        dbUser = await createUserBasedOnBM(BMAccess.access_token)
      } else if (!dbUser) throw new Error('No user found in our local database')

      ctx.session = dbUser
      ctx.body = dbUser
    } catch (e) {
      ctx.throw(400, e.message)
    }
  })

  router.post('/refresh', async ctx => {
    let { userId } = ctx.request.body

    let programs = await cached.Program.findAll({
      attributes: [ 'id', 'alias', 'title' ],
      where: {
        '$Users.id$': userId,
        is_enabled: true
      },
      include: [
        {
          model: models.User,
          attributes: [],
          through: {
            attributes: []
          }
        }
      ]
    })

    ctx.body = {
      status: 200,
      result: {
        programs
      }
    }
  })
}
