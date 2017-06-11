const { pick } = require('lodash')
const { models } = require('mongoose')

module.exports = router => {
  router.get('/', async ctx => {})
  /**
   * initiate feedback page
   *
   * 1. get current user current progam
   * 2. check if there are some classes to rate in this program
   * 3. check if user already left feedback for nearest class.
   * 4. check if user is in the coach group
   * TODO: get reward for rate program class
   */
  router.get('/init', async ctx => {
    const { type } = ctx.request.query
    let types = [ 'platform' ]

    let reply = null
    let lastClass = null

    if (!ctx.__.currentProgram.noClasses) {
      lastClass = await ctx.__.currentProgram.getLastClass()
      // types.push('program')
      if (lastClass) {
        types.push('class')
        if (type === 'class') reply = await models.NPS.find({ userId: ctx.__.me._id, programId: ctx.__.currentProgram._id, 'target.model': 'ProgramClass', 'target.item': lastClass._id }).limit(1).sort({ created: -1 })
      }
    }

    ctx.body = {
      status: 200,
      result: {
        types,
        reply: reply ? reply.shift() : null
      }
    }
  })

  router.post('/rate/:type', async ctx => {
    const { type } = ctx.params
    let body = pick(ctx.request.body, [ 'content', 'score' ])

    try {
      let reply = null
      if (type === 'class') {
        // потом узнать были ли занятий и достать последнее прошедшее
        let lastClass = await ctx.__.currentProgram.getLastClass()
        // если таковых нет - ошибка
        if (!lastClass) throw new Error('no class for proram found')
        //
        reply = await lastClass.addNPS(body, ctx.__.me)
      }
      if (type === 'program') {
        reply = await ctx.__.currentProgram.addNPS(body, ctx.__.me)
      }
      if (type === 'platform') {
        reply = await models.NPS.addToPlatform(body, ctx.__.me, ctx.__.currentProgram._id)
      }

      ctx.body = {
        status: 200,
        result: { reply, info: 'МОлодец' }
      }
    } catch (e) {
      ctx.log.info(e)
      ctx.body = { status: 500, message: e }
    }
  })
}
