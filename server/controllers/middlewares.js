const { models } = require('mongoose')

const checkAccess = access => async (ctx, next) => {
  if (ctx.__.me.checkAccess(access)) await next()
  else {
    ctx.body = {
      status: 403,
      message: 'Access denied'
    }
  }
}

const getSessionProgram = async (ctx, next) => {
  try {
    if (!ctx.session.currentProgram) throw new Error('no user program')
    let [ program ] = await models.Program.find({ _id: ctx.session.currentProgram }).limit(1)
    if (!program) throw new Error('program not found')

    ctx.__.currentProgram = program
    await next()
  } catch (e) {
    console.log(e)
    ctx.status = 403
    ctx.body = { status: 403, message: 'Access denied' }
  }
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
  checkAccess,
  initMeRoutes,
  getSessionProgram
}
