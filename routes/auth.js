const Router = require('koa-router')

const config = require('../config')
const services = require('../services')
const { messages } = require('../factories')
const { models, orm } = require('../models')

// ctx.cookies.set('hello', 'zxczxczxczxcczczsc2423', { key: config.api.session_key })
const { isUserAuthOnBM, getBMAccessToken } = require('../controllers/authController')

const router = new Router({ prefix: '/auth' })

router.get('/login', async (ctx, next) => {
  let isAuth = false
  const params = ctx.request.body 
  let { email, password } = { email: 'paperdoll.msk@gmail.com', password: 'Gbgbgb' }

  let user = ctx.cookies.get('molodost_user')
  let hash = ctx.cookies.get('molodost_hash')
  let userAgent = ctx.request.header['user-agent']

  try {
    if (username && !password) isAuth = await isUserAuthOnBM(user, hash, userAgent)

    //
    let { access_token } = await getBMAccessToken(email, password)

    //
    if (!access_token && !isAuth) throw new Error('No user account found on molodost.bz')

    // Проверяем наличие юзера у нас в базе данных
    let db_user = await models.User.findOne({
      attributes: [ 'id', 'name' ],
      where: { email }
    })

    if (!db_user) throw new Error('No user found in our local database')

    ctx.session.user = db_user

    ctx.body = {
      name: db_user.name
    }
  } catch (e) {
    ctx.status = 500
    ctx.body = {
      error: e.message
    }
  }
})

router.get('/version', services.general.getAPIVersionService)

module.exports = router
