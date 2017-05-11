const { models } = require('../../models')

const { isUserAuthOnBM, getBMAccessToken } = require('../../controllers/authController')

module.exports = router => {
  router.post('/logout', async ctx => {
    delete ctx.session.user
    ctx.body = {}
  })

  router.post('/login', async (ctx, next) => {
    let isAuth = false
    let { email, password } = ctx.request.body
    // todo восстановление куки с molodost.bz
    // если есть наша сессия - восстанавливать нашу сессию

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
        attributes: [ 'id', 'name', 'first_name', 'last_name', 'picture_small' ],
        where: { email }
      })

      if (!dbUser) throw new Error('No user found in our local database')

      ctx.session.user = {
        id: dbUser.id,
        name: dbUser.name,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        picture: dbUser.picture_small
      }

      ctx.body = {
        user: {
          id: dbUser.id,
          name: dbUser.name,
          firstName: dbUser.first_name,
          lastName: dbUser.last_name,
          picture: dbUser.picture_small
        }
      }
    } catch (e) {
      console.log(e)
      ctx.throw(400, e.message)
    }
  })
}
