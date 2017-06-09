const moment = require('moment')
const mongoose = require('mongoose')
const { isNil, extend } = require('lodash')

const {
  getBMAccessToken, getMyInfo, isUserAuthOnBM, getBMRecovery,
  getBMAccessTokenCredentialsOnly, getBMSignUp
} = require('../../controllers/authController')
// refreshToken

const getUser = async email => {
  let [ user ] = await mongoose.models.Users.find({ email }).limit(1).select('_id last_name first_name name picture_small').lean().cache(100)

  if (!user) return null

  const [ meta ] = await mongoose.models.UsersMeta.find({ userId: user._id }).sort({ created: -1 }).limit(1)

  return { user, meta }
}

const createUserBasedOnBM = async access => {
  let BMInfo = await getMyInfo(access.access_token)

  let userData = {
    email: BMInfo.email,
    name: BMInfo.userId,
    last_name: BMInfo.lastName,
    first_name: BMInfo.firstName,
    picture_small: 'http://static.molodost.bz/thumb/160_160_2/img/avatars/' + BMInfo.avatar
  }

  let userInfo = { birthday: BMInfo.birthDate }
  let userMeta = { molodost_id: BMInfo.userId }

  let user = await mongoose.models.Users.create(userData)
  let info = await user.updateInfo(userInfo)
  let meta = await user.updateMeta(userMeta)
  // meta = await meta.updateToken(access)
  await user.addProgram(3, {})

  return { user, info, meta }
}

const updateMolodostMeta = async (meta, BMAccess) => {
  meta = await meta.updateToken(BMAccess)
  if (!meta.molodost_id) {
    let BMInfo = await getMyInfo(BMAccess.access_token)
    meta = await meta.update({ molodost_id: BMInfo.userId })
  }
  return meta
}

module.exports = router => {
  router.get('/restore', async ctx => {
    let email = unescape(ctx.cookies.get('molodost_user'))
    let hash = ctx.cookies.get('molodost_hash')
    let BMAccess, res

    try {
      if (hash && email) {
        ctx.session = {}

        BMAccess = await isUserAuthOnBM(email, hash, ctx.request.headers['user-agent'])

        if (BMAccess) {
          res = await getUser(email)
          if (!res) res = await createUserBasedOnBM(BMAccess)
          else res.meta = await updateMolodostMeta(res.meta, BMAccess)
        } else throw new Error('no access token')

        res.user.radar_id = res.meta ? res.meta.radar_id : null

        ctx.session.user = extend(res.user, { radar_access_token: res.meta.radar_access_token || false })
        ctx.session.uid = res.user._id
      }

      ctx.body = { user: res.user }
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
      ctx.session = {}

      let BMAccess = await getBMAccessToken(email, password)
      if (!BMAccess.access_token) throw new Error('No user account found on molodost.bz')

      // Проверяем наличие юзера у нас в базе данных
      let { user, meta } = await getUser(email)
      if (!user && BMAccess.access_token) {
        let res = await createUserBasedOnBM(BMAccess)
        user = res.user
        meta = res.meta
      } else if (!user) throw new Error('No user found in our local database')
      else meta = await updateMolodostMeta(meta, BMAccess)

      user.radar_id = meta ? meta.radar_id : null

      ctx.session.user = extend(user, { radar_access_token: meta.radar_access_token || false })
      ctx.session.uid = user._id

      ctx.body = { user }
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

    // проверим валиден ли access_token
    // TODO: refresh token
    if (userMeta && today.isAfter(moment(userMeta.token_expires).subtract(1, 'day'), 'days')) {
      // console.log('need to refresh token')
      // try {
      //   let token = await refreshToken(userMeta.molodost_refresh)
      //   // console.log(token)
      // } catch (e) {
      //   console.log(e)
      // }
    }

    let active = []
    let volunteer = false
    /**
     * Нужно отсечь дефолтную программу, если у человека есть активная программа прямо сейчас и он нигде не волонтер
     */
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
