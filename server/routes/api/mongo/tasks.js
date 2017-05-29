const { models } = require('mongoose')

let defaultReplies = [
  {
    title: 'Я ответил',
    content: 'Ответ на задание',
    userName: 'bm-paperdoll',
    task: 'Тестовое задание'
  }
]

module.exports = router => {
  router.get('/', async ctx => {
    // let programId = ctx.query.programId || 3

    let tasks = await models.Task.find({
      // targetProgram: programId,
      // enabled: true
    })

    let replied = await models.TaskReply.find({})

    ctx.body = {
      status: 200,
      result: { tasks, replied }
    }
  })

  router.get('/defaults', async ctx => {
    await models.TaskReply.initDefaults(defaultReplies)

    ctx.body = {
      status: 200
    }
  })
}
