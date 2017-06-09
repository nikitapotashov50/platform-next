const moment = require('moment')
const mongoose = require('mongoose')
const { isNil } = require('lodash')

const {
  getBMAccessToken, getMyInfo, isUserAuthOnBM, getBMRecovery,
  getBMAccessTokenCredentialsOnly, getBMSignUp
} = require('../../controllers/authController')

const getUser = async email => {
  let [ user ] = await mongoose.models.Users.find({ email }).limit(1).select('_id last_name first_name name picture_small').lean().cache(100)

  if (!user) return null

  const userMeta = await mongoose.models.UsersMeta.findOne({
    userId: user._id
  })

  user.radar_id = userMeta.radar_id
  user.radar_access_token = userMeta.radar_access_token

  return { user }
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

    try {
      if (hash && email) {
        BMAccess = await isUserAuthOnBM(email, hash, ctx.request.headers['user-agent'])

        if (BMAccess) {
          user = await getUser(email)
          if (!user) user = await createUserBasedOnBM(BMAccess)
        }
        ctx.session = user
        ctx.session.uid = user.user._id
      }
      ctx.body = user
    } catch (e) {
      console.log(e)
      ctx.body = { status: 500, message: e }
    }
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
      ctx.session.uid = dbUser.user._id

      ctx.body = dbUser
    } catch (e) {
      ctx.throw(400, e.message)
    }
  })

  router.post('/refresh', async ctx => {
    let { userId } = ctx.request.body
    let [ user ] = await mongoose.models.Users.find({ _id: userId }).limit(1).select('programs subscriptions meta')

    const userMeta = await user.getMeta()
    let programs = await user.getPrograms()

    if (!programs.length) {
      await user.addProgram(3, {})
      programs = await user.getPrograms()
    }

    let today = moment()
    let active = []
    let volunteer = false

    /**
     * Нужно отсечь дефолтную программу, если у человека есть активная программа прямо сейчас и он нигде не волонтер
     */
    ctx.log.info(programs)
    programs = programs.map(el => {
      let program = el.programId
      if (moment(program.start_at) < today && moment(program.finish_at) > today && el.programId._id !== 3) {
        active.push(el.programId._id)
        if (el.roleId._id !== 3) volunteer = true
      }

      return {
        _id: el.programId._id,
        role: el.roleId.code,
        alias: el.programId.alias,
        title: el.programId.title,
        start: el.programId.start_at,
        finish: el.programId.finish_at
      }
    }).filter(x => ((x._id !== 3) || (!active.length || volunteer)))
    ctx.log.info(active)
    if (!ctx.session.currentProgram) ctx.session.currentProgram = active.length > 0 ? active[0] : 3

    ctx.body = {
      status: 200,
      result: {
        programs,
        subscriptions: user.subscriptions,
        radar_id: userMeta.radar_id,
        radar_access: !isNil(userMeta.radar_access_token)
      }
    }
  })
}
