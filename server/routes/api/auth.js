const { models } = require('../../models')

// ctx.cookies.set('hello', 'zxczxczxczxcczczsc2423', { key: config.api.session_key })
const { isUserAuthOnBM, getBMAccessToken } = require('../../controllers/authController')

module.exports = router => {
  router.post('/login', async (ctx, next) => {
    let isAuth = false
    let { email, password } = ctx.request.body

    let user = ctx.cookies.get('molodost_user')
    let hash = ctx.cookies.get('molodost_hash')
    let userAgent = ctx.request.header['user-agent']

    try {
      if (email && !password) isAuth = await isUserAuthOnBM(user, hash, userAgent)

      //
      let BMAccess = await getBMAccessToken(email, password)
      //
      if (!BMAccess.access_token && !isAuth) throw new Error('No user account found on molodost.bz')

      // Проверяем наличие юзера у нас в базе данных
      let dbUser = await models.User.findOne({
        attributes: [ 'id', 'name' ],
        where: { email }
      })

      if (!dbUser) throw new Error('No user found in our local database')

      ctx.session.user = dbUser.toJSON()
      console.log(ctx.session)

      ctx.body = {
        user: {
          id: dbUser.id,
          name: dbUser.name
        }
      }
    } catch (e) {
      console.log(e)
      ctx.throw(400, e.message)
    }
  })
}