const { models } = require('../../models')

const { getBMAccessToken } = require('../../controllers/authController')

const getUser = async email => {
  let dbUser = await models.User.findOne({
    attributes: [ 'id', 'name', 'first_name', 'last_name', 'picture_small' ],
    where: { email }
  })

  return dbUser
}

const userResponse = user => ({
  id: user.id,
  name: user.name,
  lastName: user.last_name,
  firstName: user.first_name,
  picture: user.picture_small
})

module.exports = router => {
  router.post('/restore', async ctx => {
    let { user, hash } = ctx.request.body
    user = unescape(user)
    hash = unescape(hash)

    let isAuth = false

    // if (user && hash) isAuth = await isUserAuthOnBM(user, hash, ctx.request.header['user-agent'])
    if (user && hash) isAuth = true

    let dbUser = await getUser(user)

    let sessionData = userResponse(dbUser)
    ctx.session.user = sessionData

    ctx.body = {
      isAuth,
      user: sessionData
    }
  })

  router.post('/logout', async ctx => {
    delete ctx.session.user
    ctx.body = {}
  })

  router.post('/login', async (ctx, next) => {
    let isAuth = false
    let { email, password } = ctx.request.body

    try {
      let BMAccess = await getBMAccessToken(email, password)
      //
      if (!BMAccess.access_token && !isAuth) throw new Error('No user account found on molodost.bz')

      // Проверяем наличие юзера у нас в базе данных
      let dbUser = await getUser(email)

      if (!dbUser) throw new Error('No user found in our local database')

      let sessionData = userResponse(dbUser)
      ctx.session.user = sessionData
      ctx.body = {
        user: sessionData
      }
    } catch (e) {
      console.log(e)
      ctx.throw(400, e.message)
    }
  })
}
