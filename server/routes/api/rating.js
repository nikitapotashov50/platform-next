const { orm, models } = require('../../models')
const axios = require('axios')

const findUsers = join => models.User.findAll({
  attributes: [
    'id',
    'name',
    'first_name',
    'last_name',
    'picture_small',
    [ orm.col('Goals.occupation'), 'occupation' ],
    [ orm.fn('sum', orm.col('Incomes.amount')), 'money' ],
    [ orm.fn('count', orm.col('Incomes.id')), 'income_count' ]
  ],
  include: [
    {
      attributes: [],
      model: models.Income
    },
    {
      as: 'Goals',
      attributes: [],
      model: models.Goal
    },
    join
  ],
  group: [
    orm.col('id'),
    orm.col('name'),
    orm.col('first_name'),
    orm.col('Goals.occupation')
  ],
  order: 'money desc',
  limit: 100,
  subQuery: false
})

const findGameGroups = async (program, type) => {
  const [data] = await orm.query(`
    SELECT groups.id, groups.title, groups.money, groups_game.type, cities.name AS city FROM groups
    INNER JOIN programs_groups ON programs_groups.group_id = groups.id
    INNER JOIN groups_game ON groups_game.group_id = groups.id
    INNER JOIN users ON groups.leader_id = users.id
    INNER JOIN users_programs ON users_programs.user_id = users.id
    LEFT JOIN cities ON users_programs.city_id = cities.id
    WHERE programs_groups.program_id = ${program}
    AND groups_game.type = '${type}'
    ORDER BY groups.money DESC
    LIMIT 50;
  `)
  const ids = data.map(row => row.id)
  return data.filter((row, i) => i === ids.indexOf(row.id))
}

module.exports = router => {
  // список всех рейтингов
  router.get('/all/:program/:userId', async ctx => {
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

  // рейтинг по строке поиска
  router.get('/search/:program/:searchInput/:offset', async ctx => {
    const limit = 20
    const { program, searchInput, offset } = ctx.params
    console.log(offset)
    const data = await models.User.findAll({
      attributes: [
        'id',
        'name',
        'first_name',
        'last_name',
        'picture_small',
        [ orm.col('Goals.occupation'), 'occupation' ],
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
        },
        {
          as: 'Goals',
          attributes: [],
          model: models.Goal
        }
      ],
      group: [
        orm.col('id'),
        orm.col('name'),
        orm.col('first_name'),
        orm.col('Goals.occupation')
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
            '$Goals.occupation$': {
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
      limit,
      offset: limit * +offset,
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
          required: true,
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
  router.get('/tens/:program/:userId', async ctx => {
    const { program } = ctx.params
    const data = await findGameGroups(program, 'ten')
    ctx.body = data
  })

  // рейтинг сотен
  router.get('/hundreds/:program/:userId', async ctx => {
    const { program } = ctx.params
    const data = await findGameGroups(program, 'hundred')
    ctx.body = data
  })

  // рейтинг полков
  router.get('/polks/:program/:userId', async ctx => {
    const { program } = ctx.params
    const data = await findGameGroups(program, 'polk')
    ctx.body = data
  })

  // рейтинг городов
  router.get('/cities/:program/:userId', async ctx => {
    const { program } = ctx.params
    const [data] = await orm.query(`
      SELECT SUM(incomes.amount) AS money, users_programs.city_id AS id, cities.name AS title FROM users
      LEFT JOIN incomes ON users.id = incomes.user_id
      LEFT JOIN users_programs ON users.id = users_programs.user_id
      INNER JOIN cities ON users_programs.city_id = cities.id
      WHERE program_id = ${program}
      GROUP BY id
      ORDER BY money DESC;
    `)
    const res = data.map(row => Object.assign({}, row, {type: 'city'}))
    ctx.body = res
  })

  // рейтинг по городу
  router.get('/city/:program/:cityId', async ctx => {
    const { program, cityId } = ctx.params
    const join = {
      required: true,
      attributes: [ 'id' ],
      model: models.Program,
      where: {
        id: program
      },
      through: {
        attributes: [],
        where: {
          city_id: cityId
        }
      }
    }
    const data = await findUsers(join)
    ctx.body = data
  })

  // список сотен в полке
  router.get('/polk/:program/:polkId', async ctx => {
    const { program, polkId } = ctx.params
    const data = await models.Group.findAll({
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
            type: 'hundred',
            parent_id: polkId
          },
          as: 'GameGroups'
        }
      ],
      order: 'money desc'
    })
    ctx.body = data
  })

  // список десяток в сотне
  router.get('/hundred/:program/:hundredId', async ctx => {
    const { program, hundredId } = ctx.params
    const data = await models.Group.findAll({
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
            type: 'ten',
            parent_id: hundredId
          },
          as: 'GameGroups'
        }
      ],
      order: 'money desc'
    })
    ctx.body = data
  })

  // список юзеров в десятке
  router.get('/ten/:program/:tenId', async ctx => {
    const { tenId } = ctx.params
    const join = {
      attributes: [],
      model: models.Group,
      as: 'Groups',
      where: { id: tenId }
    }
    const data = await findUsers(join)
    ctx.body = data
  })

  // рейтинг тренеров
  router.get('/coaches/:program/:userId', async ctx => {
    const { program } = ctx.params
    const data = await models.Group.findAll({
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
    ctx.body = data
  })

  // рейтинг по тренерской группе
  router.get('/coach/:program/:groupId', async ctx => {
    const { groupId } = ctx.params
    const join = {
      attributes: [],
      model: models.Group,
      as: 'Groups',
      where: { id: groupId }
    }
    const data = await findUsers(join)
    ctx.body = data
  })

  // рейтинг спикеров
  router.get('/speakers/:program', async ctx => {
    const { data } = await axios(`http://tgbiz.ru/telegram/bots/api/molodostbzbot_spk_x3Bnq0.php?event=${ctx.params.program === '1' ? '2' : '1'}`)
    ctx.body = data
  })
}
