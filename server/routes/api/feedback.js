const { models, views, orm } = require('../../models')

const getCities = async () => {
  let res = await views.NPSCityView.findAll({
    attributes: [
      'city_id',
      [ 'city_name', 'name' ],
      [ orm.fn('count', orm.col('NPSCityView.id')), 'count' ]
    ],
    inclide: [
      {
        attributes: [ 'name' ],
        model: models.City
      }
    ],
    group: [ orm.col('city_id'), orm.col('city_name') ]
  })

  return res
}

module.exports = router => {
  router.post('/', async ctx => {
    let { limit, offset } = ctx.request.body

    let { rows, count } = await models.NPS.findAndCountAll({
      include: [
        {
          attributes: [ 'name', 'first_name', 'last_name', 'picture_small' ],
          model: models.User
        }
      ],
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
    let result = await getCities()

    ctx.body = {
      cities: result
    }
  })
}
