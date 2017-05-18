const { orm, models } = require('../../models')

const findUsers = join => models.User.findAll({
  attributes: [
    'id',
    'name',
    'first_name',
    'last_name',
    'picture_small',
    [ orm.fn('sum', orm.col('Incomes.amount')), 'money' ],
    [ orm.fn('count', orm.col('Incomes.id')), 'income_count' ]
  ],
  include: [
    {
      attributes: [],
      model: models.Income
    },
    join
  ],
  group: [
    orm.col('id'),
    orm.col('name'),
    orm.col('first_name')
  ],
  order: 'money desc',
  limit: 100,
  subQuery: false
})

module.exports = router => {
  // список всех рейтингов
  router.get('/all/:program', async ctx => {
    const { program } = ctx.params
    const join = {
      required: true,
      attributes: [ 'id' ],
      model: models.Program,
      where: { id: program },
      through: {
        attributes: []
      }
    }
    const data = await findUsers(join)
    ctx.body = data
  })

  // рейтинги моей десятки
  router.get('/myten/:program/:userId', async ctx => {
    const { userId, program } = ctx.params
    const [ { id: groupId } ] = await models.Group.findAll({
      attributes: ['id'],
      include: [
        {
          model: models.GameGroup,
          where: {
            type: 'ten'
          },
          as: 'GameGroups'
        },
        {
          attributes: [],
          as: 'Programs',
          model: models.Program,
          where: { id: program }
        },
        {
          as: 'Users',
          attributes: [],
          model: models.User,
          where: {
            id: userId
          }
        }
      ]
    })
    const join = {
      attributes: [],
      model: models.Group,
      as: 'Groups',
      where: { id: groupId }
    }
    const data = await findUsers(join)
    ctx.body = data
  })

  // рейтинги моей команды
  router.get('/mygroup/:program/:userId', async ctx => {
    const { userId, program } = ctx.params
    const [ { id: groupId } ] = await models.Group.findAll({
      attributes: ['id'],
      include: [
        {
          model: models.CoachGroup,
          as: 'CoachGroups'
        },
        {
          attributes: [],
          as: 'Programs',
          model: models.Program,
          where: { id: program }
        },
        {
          as: 'Users',
          attributes: [],
          model: models.User,
          where: {
            id: userId
          }
        }
      ]
    })
    const join = {
      attributes: [],
      model: models.Group,
      as: 'Groups',
      where: { id: groupId }
    }
    const data = await findUsers(join)
    ctx.body = data
  })

  // рейтинг десяток
  router.get('/ten/:program', async ctx => {
    const { program } = ctx.params
    const myProgramGroups = await models.Group.findAll({
      attributes: ['id', 'money', 'is_blocked', 'title'],
      include: [
        {
          attributes: [],
          as: 'Programs',
          model: models.Program,
          where: { id: program }
        },
        {
          model: models.GameGroup,
          where: {
            type: 'ten'
          },
          as: 'GameGroups'
        }
      ],
      order: 'money desc',
      limit: 100
    })
    ctx.body = myProgramGroups
  })

  // рейтинг сотен
  router.get('/hundred/:program', async ctx => {
    const { program } = ctx.params
    const myProgramGroups = await models.Group.findAll({
      attributes: ['id', 'money', 'is_blocked', 'title'],
      include: [
        {
          attributes: [],
          as: 'Programs',
          model: models.Program,
          where: { id: program }
        },
        {
          model: models.GameGroup,
          where: {
            type: 'hundred'
          },
          as: 'GameGroups'
        }
      ],
      order: 'money desc',
      limit: 100
    })
    ctx.body = myProgramGroups
  })

  // рейтинг полков
  router.get('/squad/:program', async ctx => {
    const { program } = ctx.params
    const myProgramGroups = await models.Group.findAll({
      attributes: ['id', 'money', 'is_blocked', 'title'],
      include: [
        {
          attributes: [],
          as: 'Programs',
          model: models.Program,
          where: { id: program }
        },
        {
          model: models.GameGroup,
          where: {
            type: 'polk'
          },
          as: 'GameGroups'
        }
      ],
      order: 'money desc',
      limit: 100
    })
    ctx.body = myProgramGroups
  })

  // рейтинг тренеров
  router.get('/coaches/:program', async ctx => {
    const { program } = ctx.params
    const myProgramGroups = await models.Group.findAll({
      attributes: ['id', 'money', 'is_blocked', 'title'],
      include: [
        {
          attributes: [],
          as: 'Programs',
          model: models.Program,
          where: { id: program }
        },
        {
          required: true,
          model: models.CoachGroup,
          as: 'CoachGroups'
        }
      ],
      order: 'money desc',
      limit: 100
    })
    ctx.body = myProgramGroups
  })
}
