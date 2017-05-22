const { orm, models } = require('../../models')
const axios = require('axios')

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

const findGroups = (program, type) => {
  const join = type ? {
    model: models.GameGroup,
    where: {
      type
    },
    as: 'GameGroups'
  } : {
    required: true,
    model: models.CoachGroup,
    as: 'CoachGroups'
  }

  return models.Group.findAll({
    attributes: ['id', 'money', 'is_blocked', 'title'],
    include: [
      {
        attributes: [],
        as: 'Programs',
        model: models.Program,
        where: { id: program }
      },
      join
    ],
    order: 'money desc',
    limit: 100
  })
}

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

  router.get('/search/:program/:searchInput', async ctx => {
    const { program, searchInput } = ctx.params
    const data = await models.User.findAll({
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
        {
          required: true,
          attributes: [ 'id' ],
          model: models.Program,
          where: { id: program },
          through: {
            attributes: []
          }
        }
      ],
      group: [
        orm.col('id'),
        orm.col('name'),
        orm.col('first_name')
      ],
      order: 'money desc',
      where: {
        $or: [
          {
            first_name: {
              $like: `%${searchInput}%`
            }
          },
          {
            last_name: {
              $like: `%${searchInput}%`
            }
          },
          {
            first_name: {
              $like: `%${searchInput.split(' ')[0]}%`
            },
            last_name: {
              $like: `%${searchInput.split(' ')[1]}%`
            }
          },
          {
            first_name: {
              $like: `%${searchInput.split(' ')[1]}%`
            },
            last_name: {
              $like: `%${searchInput.split(' ')[0]}%`
            }
          }
        ]
      },
      limit: 100,
      subQuery: false
    })
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
  router.get('/tens/:program', async ctx => {
    const { program } = ctx.params
    const data = await findGroups(program, 'ten')
    ctx.body = data
  })

  // рейтинг сотен
  router.get('/hundreds/:program', async ctx => {
    const { program } = ctx.params
    const data = await findGroups(program, 'hundred')
    ctx.body = data
  })

  // рейтинг полков
  router.get('/polks/:program', async ctx => {
    const { program } = ctx.params
    const data = await findGroups(program, 'polk')
    ctx.body = data
  })

  // список сотен в полке, пока не реализовано
  // router.get('/polk/:program/:polkId', async ctx => {
  //   const { program, polkId } = ctx.params
  //   ctx.body = data
  // })

  // рейтинг тренеров
  router.get('/coaches/:program', async ctx => {
    const { program } = ctx.params
    const myProgramGroups = await findGroups(program)
    ctx.body = myProgramGroups
  })

  router.get('/speakers/:program', async ctx => {
    const { data } = await axios(`http://tgbiz.ru/telegram/bots/api/molodostbzbot_spk_x3Bnq0.php?event=${ctx.params.program === '1' ? '2' : '1'}`)
    ctx.body = data
  })
}
