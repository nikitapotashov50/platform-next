const { models } = require('mongoose')

const keyObj = (docs, options = {}) => {
  if (!options.key) options.key = '_id'

  return docs.reduce((object, item) => {
    if (object.middleware) object.middleware(item)
    object[item[options.key]] = item
    return object
  }, {})
}

const initMeRoutes = async (ctx, next) => {
  try {
    if (!ctx.session || !ctx.session.user) throw new Error('no user')
    let [ user ] = await models.Users.find({ _id: ctx.session.user._id }).limit(1)
    if (!user) throw new Error('no user found')

    ctx.__.me = user

    await next()
  } catch (e) {
    ctx.status = 403
    ctx.body = {
      status: 403,
      message: 'Access denied'
    }
  }
}

module.exports = {
  keyObj,
  initMeRoutes
}
