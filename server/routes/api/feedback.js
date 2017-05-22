const { models, views, orm } = require('../../models')

let getTypeInclusion = type => {
  let include = {}

  if (type === 'platform') {
    include = {
      required: true,
      attributes: [],
      model: models.NPSPlatform
    }
  }

  if (type === 'program') {
    include = {
      required: true,
      attributes: [],
      as: 'ProgramClassNps',
      model: models.ProgramClass
    }
  }

  if (type === 'coach') {
    include = {
      required: true,
      attributes: [],
      as: 'GroupNps',
      model: models.Group
    }
  }

  return include
}

const calcNPS = (replies, total) => {
  const totalCount = replies.length

  let scores = {}
  let types = [ 'score_1', 'score_2', 'score_3', 'total' ]

  replies.filter(el => {
    for (var i in types) {
      let type = types[i]
      if (!scores[type]) scores[type] = [ 0, 0 ]

      if (el.get(type) >= 9) scores[type][0] = scores[type][0] + 1
      else if (el.get(type) > 0 && el.get(type) <= 6) scores[type][1] = scores[type][1] + 1
    }
  })

  let result = {}
  for (var key in scores) {
    let item = scores[key]
    result[item][key] = (((item[0] * 100) / totalCount) - ((item[1] * 100) / totalCount)).toFixed(2)
  }

  return result
}

module.exports = router => {
  router.get('/', async ctx => {
    let { limit = 40, offset = 0, type } = ctx.request.query
    limit = parseInt(limit)
    offset = parseInt(offset)

    let include = [
      {
        attributes: [ 'name', 'first_name', 'last_name', 'picture_small' ],
        model: models.User
      }
    ]

    if (type) include.push(getTypeInclusion(type))

    let { rows, count } = await models.NPS.findAndCountAll({
      include,
      order: [
        [ 'created_at', 'DESC' ]
      ],
      limit,
      offset: limit * offset
    })

    ctx.body = {
      count,
      nps: rows
    }
  })

  router.get('/cities', async ctx => {
    let { type } = ctx.request.query
    let include = []

    if (type) include.push(getTypeInclusion(type))

    let npsIdsResult = await models.NPS.findAll({
      include
    })

    let where = {
      id: { $in: npsIdsResult.map(el => el.id) }
    }

    let result = await views.NPSCityView.findAll({
      where,
      attributes: [
        'city_id',
        [ 'city_name', 'name' ],
        [ orm.fn('group_concat', orm.col('NPSCityView.score_1')), 'score_1' ],
        [ orm.fn('group_concat', orm.col('NPSCityView.score_2')), 'score_2' ],
        [ orm.fn('group_concat', orm.col('NPSCityView.score_3')), 'score_3' ],
        [ orm.fn('group_concat', orm.col('NPSCityView.total')), 'total' ],
        [ orm.fn('count', orm.col('NPSCityView.id')), 'count' ]
      ],
      group: [ orm.col('city_id'), orm.col('city_name') ]
    })

    let calculated = calcNPS(result)

    ctx.body = {
      calculated,
      cities: result
    }
  })
}
