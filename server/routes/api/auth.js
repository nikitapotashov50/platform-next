const moment = require('moment')
const mongoose = require('mongoose')
const { isNil, extend, omit } = require('lodash')

const {
  getBMAccessToken, getMyInfo, isUserAuthOnBM, getBMRecovery,
  getBMAccessTokenCredentialsOnly, getBMSignUp, getBMProgramById, getProgramCity
} = require('../../controllers/authController')

const getUser = async email => {
  let [ user ] = await mongoose.models.Users.find({ email }).limit(1).select('_id last_name first_name programs name role picture_small')

  if (!user) return null

  const [ meta ] = await mongoose.models.UsersMeta.find({ userId: user._id }).sort({ created: -1 }).limit(1)

  return { user, meta }
}

const checkUserPrograms = async (meta, user, bmProgramId) => {
  if (!bmProgramId || !meta.molodost_id || !meta.molodost_access) return false

  let [ program ] = await mongoose.models.Program.find({ molodost_id: bmProgramId }).limit(1)
  if (!program) throw new Error(`no program exists ${bmProgramId}`)

  if (user.isInPrograms([ program._id ])) return true

  let isInProgram = await getBMProgramById(meta.molodost_id, bmProgramId, meta.molodost_access)

  if (isInProgram.type === 'success' && isInProgram.valid) {
    let city = await mongoose.models.City.getNullCity()

    let programCity = await getProgramCity(meta.molodost_id, bmProgramId, meta.molodost_access)
    if (programCity.type === 'success' && programCity.city_name) city = await mongoose.models.City.getOrCreate(programCity.city_name, programCity)

    await user.addProgram(program._id, { cityId: city._id })
    return true
  }

  return false
}

const createUserBasedOnBM = async access => {
  let BMInfo = await getMyInfo(access.access_token)

  let userData = {
    email: BMInfo.email,
    name: BMInfo.userId,
    last_name: BMInfo.lastName,
    first_name: BMInfo.firstName,
    picture_small: BMInfo.avatar ? ('http://static.molodost.bz/thumb/160_160_2/img/avatars/' + BMInfo.avatar) : null
  }

  let userInfo = { birthday: BMInfo.birthDate }
  let userMeta = { molodost_id: BMInfo.userId }

  let user = await mongoose.models.Users.create(userData)
  let meta = await user.updateMeta(userMeta)

  meta = await meta.updateToken(access)
  await user.updateInfo(userInfo)
  await user.addProgram(3, {})

  return { user, meta }
}

const updateMolodostMeta = async (meta, BMAccess) => {
  meta = await meta.updateToken(BMAccess)
  if (!meta.molodost_id) {
    let BMInfo = await getMyInfo(BMAccess.access_token)
    meta = await meta.update({ molodost_id: BMInfo.userId })
  }
  return meta
}

const getSessionUser = async (email, access) => {
  let res = await getUser(email)

  if (!res || !res.user) res = await createUserBasedOnBM(access)
  else if (res.meta) res.meta = await updateMolodostMeta(res.meta, access)

  if (!res || !res.user) throw new Error('error getting user')

  await checkUserPrograms(res.meta, res.user, 94)

  let add = { radar_id: null, radar_access_token: false }
  if (res.meta) {
    add = extend(add, {
      radar_id: res.meta.radar_id || null,
      molodost_id: res.meta.molodost_id || null,
      radar_access_token: res.meta.radar_access_token || false
    })
  }

  return extend(res.user, add)
}

module.exports = router => {
  router.get('/restore', async ctx => {
    let email = unescape(ctx.cookies.get('molodost_user'))
    let hash = ctx.cookies.get('molodost_hash')
    let BMAccess

    try {
      if (hash && email) {
        ctx.session = {}

        BMAccess = await isUserAuthOnBM(email, hash, ctx.request.headers['user-agent'])
        if (!BMAccess) throw new Error('no access token')

        let user = await getSessionUser(email, BMAccess)

        ctx.session.user = user
        ctx.session.uid = user._id

        ctx.body = { user: omit(user, [ 'radar_access_token' ]) }
      } else ctx.body = { user: null }
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
      if (!BMAccess) throw new Error('No user account found on molodost.bz')

      let user = await getSessionUser(email, BMAccess)
      ctx.session.user = user
      ctx.session.uid = user._id

      ctx.body = { user: omit(user, [ 'radar_access_token' ]) }
    } catch (e) {
      console.log(e)
      ctx.throw(400, e.message)
    }
  })

  router.post('/refresh', async ctx => {
    try {
      let { userId } = ctx.request.body
      if (!userId) throw new Error('no user id specified')
      let [ user ] = await mongoose.models.Users.find({ _id: userId }).limit(1).select('programs subscriptions role meta')
      if (!user) throw new Error('no user found')

      const userMeta = await user.getMeta()

      // проверка на присутствие программы
      let res = await checkUserPrograms(userMeta, user, 94)

      let programs = await user.getPrograms()

      if (!userMeta.wallet) userMeta.getWallet()

      if (!programs.length) {
        await user.addProgram(3, {})
        programs = await user.getPrograms()
      }

      let today = moment()
      let active = []
      let volunteer = false

      programs = programs.map(el => {
        let program = el.programId
        /**
         * Нужно отсечь дефолтную программу, если у человека есть активная программа прямо сейчас и он нигде не волонтер
         */
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
          isAdmin: user.role === 3,
          program: ctx.session.currentProgram,
          subscriptions: user.subscriptions,
          radar_id: userMeta.radar_id,
          radar_access: !isNil(userMeta.radar_access_token)
        }
      }
    } catch (e) {
      console.log(e)
      ctx.body = { status: 500, message: e }
    }
  })
}
