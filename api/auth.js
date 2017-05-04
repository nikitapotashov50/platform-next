const Router = require('koa-router')
const { models } = require('../models')

// ctx.cookies.set('hello', 'zxczxczxczxcczczsc2423', { key: config.api.session_key })
const { isUserAuthOnBM, getBMAccessToken } = require('../controllers/authController')

const router = new Router({ prefix: '/auth' })

router.get('/login', async (ctx, next) => {
  let isAuth = false
  let { email, password } = { email: 'paperdoll.msk@gmail.com', password: 'Gbgbgb' }

  let user = ctx.cookies.get('molodost_user')
  let hash = ctx.cookies.get('molodost_hash')
  let userAgent = ctx.request.header['user-agent']

  try {
    if (email && !password) isAuth = await isUserAuthOnBM(user, hash, userAgent)

    //
    let { accessToken } = await getBMAccessToken(email, password)

    //
    if (!accessToken && !isAuth) throw new Error('No user account found on molodost.bz')

    // Проверяем наличие юзера у нас в базе данных
    let dbUser = await models.User.findOne({
      attributes: [ 'id', 'name' ],
      where: { email }
    })

    if (!dbUser) throw new Error('No user found in our local database')

    ctx.session.user = dbUser

    ctx.body = {
      name: dbUser.name
    }
  } catch (e) {
    ctx.status = 500
    ctx.body = {
      error: e.message
    }
  }
})

module.exports = router
