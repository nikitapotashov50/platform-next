const Router = require('koa-router')
const sql = require('sql-template-strings')
const { models, orm } = require('../models')
const { floor, toNumber } = require('lodash')
const pMap = require('p-map')

const router = new Router({ prefix: '/field' })

// получение относительной дельты
const getRelDelta = (now, was) => floor((now - was) / was, 2) * 100

// МЗС показатели
router.get('/program/:programId', async ctx => {
  // общая прибыль
  const profit = await models.Income.sum('amount')

  // сроки выполнения последнего и предпосленего еженедельных заданий
  const [[lastWeekDateRange, lastByOneWeekDateRange]] = await orm.query(sql`
    SELECT start_at, finish_at
    FROM tasks_entries
    WHERE start_at IS NOT NULL
    GROUP BY start_at, finish_at
    ORDER BY start_at DESC, finish_at DESC
    LIMIT 2
  `)

  // заработано за последнюю неделю
  const [lastWeekMoney] = await orm.query(sql`
    SELECT SUM(amount) AS money FROM incomes
    WHERE created_at BETWEEN ${lastWeekDateRange.start_at} AND ${lastWeekDateRange.finish_at}
    ORDER BY created_at
  `, {
    type: orm.QueryTypes.SELECT
  })

  // заработано за предпоследнюю неделю
  const [lastByOneWeekMoney] = await orm.query(sql`
    SELECT SUM(amount) AS money FROM incomes
    WHERE created_at BETWEEN ${lastByOneWeekDateRange.start_at} AND ${lastByOneWeekDateRange.finish_at}
    ORDER BY created_at
  `, {
    type: orm.QueryTypes.SELECT
  })

  // абсолютная Δ = деньги за последнюю неделю
  const absDelta = lastWeekMoney.money
  // относительная Δ в процентах
  const relDelta = getRelDelta(lastWeekMoney.money, lastByOneWeekMoney.money)

  ctx.body = {
    programId: ctx.params.programId,
    data: {
      // Прибыль
      profit,
      // Абсолютная Δ
      absDelta,
      // Относительная Δ
      relDelta
    }
  }
})

// МЗС показатели по пользователям
router.get('/program/:programId/users', async ctx => {
  // смещение для пагинации
  const limit = 10
  const offset = toNumber(ctx.query.offset) || 0

  // получение пользователей
  const users = await orm.query(sql`
    SELECT
      SUM(incomes.amount) AS profit,
      user.id, user.name, user.first_name, user.last_name
    FROM users AS user
    LEFT JOIN incomes ON incomes.user_id = user.id
    LEFT JOIN users_programs ON users_programs.user_id = user.id
    WHERE users_programs.program_id = ${ctx.params.programId} AND incomes.amount IS NOT NULL
    GROUP BY user.id
    LIMIT ${offset}, ${limit}
  `, {
    model: models.User
  })

  // получение прибыли за последнюю и предпоследнюю недели
  // для каждого пользователя
  const data = await pMap(JSON.parse(JSON.stringify(users)), async user => {
    const [lastWeek, lastByOneWeek] = await orm.query(sql`
      SELECT amount AS profit
      FROM incomes
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
      LIMIT 2
    `, {
      model: models.Income
    })

    // прибыль за последнюю неделю
    const lastWeekProfit = lastWeek && JSON.parse(JSON.stringify(lastWeek)).profit
    // прибыль за прошлую неделю
    const lastByOneWeekProfit = lastByOneWeek && JSON.parse(JSON.stringify(lastByOneWeek)).profit

    // Абсолютная Δ прибыли
    const absDelta = lastWeekProfit
    // Относительная Δ прибыли
    const relDelta = getRelDelta(lastWeekProfit, lastByOneWeekProfit)

    return {
      id: user.id,
      name: user.name,
      firstName: user.first_name,
      lastName: user.last_name,
      profit: {
        // прибыль
        total: user.profit,
        // Абсолютная Δ прибыли
        absDelta,
        // Абсолютная Δ прибыли
        relDelta
      }
    }
  })

  ctx.body = {
    users: data
  }
})

module.exports = router
