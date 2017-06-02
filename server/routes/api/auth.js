const { pick } = require('lodash')
// const { models } = require('../../models')

const mongoose = require('mongoose')

const { getBMAccessToken, getMyInfo, isUserAuthOnBM, getBMRecovery, getBMAccessTokenCredentialsOnly, getBMSignUp } = require('../../controllers/authController')

const getUser = async email => {
  let user = await mongoose.models.Users.findOne({ email })

  if (!user) return null

  return {
    user: pick(user, [ '_id', 'last_name', 'first_name', 'picture_small', 'name' ])
  }
}

const createUserBasedOnBM = async accessToken => {
  let BMInfo = await getMyInfo(accessToken)

  let userData = {
    email: BMInfo.email,
    name: BMInfo.userId,
    last_name: BMInfo.lastName,
    first_name: BMInfo.firstName,
    picture_small: 'http://static.molodost.bz/thumb/160_160_2/img/avatars/' + BMInfo.avatar
  }

  let userMeta = {
    birthday: BMInfo.birthDate
  }

  let user = await mongoose.models.Users.create(userData)
  await user.updateMeta(userMeta)
  await user.addProgram(3, {})

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
    ctx.body = { status: 200 }
  })

  router.post('/recover', async ctx => {
    try {
      const BMAccess = await getBMAccessTokenCredentialsOnly()

      if (!BMAccess || !BMAccess.access_token) throw new Error('no token')

      let { email } = ctx.request.body

      await getBMRecovery(email, BMAccess.access_token)

      ctx.body = { status: 200 }
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

    let [ user ] = await mongoose.models.Users
      .find({
        _id: userId
      })
      .limit(1)
      .select('programs subscriptions')

    let rawPrograms = await mongoose.models.ProgramUserMeta
      .find({
        _id: { $in: user.programs.map(el => el.meta) || [] }
      })
      .populate([
        {
          path: 'programId',
          select: 'alias title _id'
        },
        {
          path: 'roleId',
          select: 'code'
        }
      ])

    let programs = rawPrograms.map(el => ({
      _id: el.programId._id,
      role: el.roleId.code,
      alias: el.programId.alias,
      title: el.programId.title
    }))

    ctx.body = {
      status: 200,
      result: {
        programs,
        subscriptions: user.subscriptions
      }
    }
  })
}
