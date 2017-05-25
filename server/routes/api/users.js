const { models, orm } = require('../../models')
const { getUserGroups, getUserSubscribers } = require('../../controllers/users')

// let user = await cached.User.findOne({
//       where: {
//         name: ctx.params.username
//       },
//       include: [
//         {
//           required: false,
//           model: models.Goal,
//           attributes: [ 'a', 'b', 'occupation' ],
//           where: {
//             is_closed: 0
//           }
//         },
//         {
//           required: false,
//           as: 'Groups',
//           model: models.Group,
//           where: { is_blocked: 0 },
//           attributes: [ 'title', 'id' ],
//           through: {
//             attributes: []
//           }
//         },
//         {
//           required: false,
//           as: 'Subscriptions',
//           model: models.User,
//           attributes: [ 'name', 'picture_small', 'last_name', 'first_name', 'id' ],
//           through: {
//             attributes: []
//           }
//         },
//         {
//           required: false,
//           as: 'Subscribers',
//           model: models.User,
//           attributes: [ 'name', 'picture_small', 'last_name', 'first_name', 'id' ],
//           through: {
//             attributes: []
//           }
//         }
//       ]
//     })

//     if (!user) {
//       ctx.body = {
//         status: 404
//       }
//     } else {
//       ctx.body = {
//         user,
//         goal: user.Goals,
//         groups: user.Groups,
//         subscriptions: user.Subscriptions,
//         subscribers: user.Subscribers
//       }
//     }
//   })

module.exports = router => {
  router.get('/user', async ctx => {
    try {
      let { username } = ctx.query

      if (!username) throw { status: 404, message: 'No username specified' } // eslint-disable-line no-throw-literal

      // достане сначала самого юзера с юзернеймом
      let user = await models.User.findOne({
        where: {
          name: username
        },
        attributes: [
          'id', 'picture_small', 'picture_large', 'name', 'first_name', 'last_name',
          [ orm.col('Goals.occupation'), 'occupation' ],
          [ orm.col('Goals.a'), 'a' ],
          [ orm.col('Goals.b'), 'b' ],
          [ orm.col('Goals.fact'), 'fact' ]
        ],
        include: [
          {
            required: false,
            duplicating: false,
            model: models.Goal,
            attributes: []
          }
        ]
      })

      if (!user) throw { status: 404, message: 'User not found' } // eslint-disable-line no-throw-literal

      ctx.body = {
        status: 200,
        result: {
          user
        }
      }
    } catch (e) {
      ctx.body = {
        status: e.status,
        message: e.message
      }
    }
  })

  router.bridge('/user/:id', router => {
    router.get('/groups', async ctx => {
      let { id } = ctx.params
      let { limit = 3 } = ctx.query

      let groups = await getUserGroups(id, limit)

      ctx.body = {
        status: 200,
        result: {
          groups: groups.rows,
          groups_total: groups.count
        }
      }
    })

    router.get('/subscribers', async ctx => {
      let { id } = ctx.params
      let { limit = 6 } = ctx.query

      let subscribers = await getUserSubscribers(id, limit)

      ctx.body = {
        status: 200,
        result: {
          subscribers: subscribers.rows,
          subscribers_total: subscribers.count
        }
      }
    })

    router.get('/subscriptions_count', async ctx => {
      let { id } = ctx.params

      let [ data ] = await orm.query(
        'SELECT COUNT(`id`) AS `count` FROM `users` INNER JOIN `user_subscribers` AS `subscribers` ON `users`.`id` = `subscribers`.`user_id` WHERE `subscribers`.`subscribe_user_id` = :user_id GROUP BY `subscribers`.`subscribe_user_id` ',
        {
          replacements: { user_id: id }
        }
      )

      ctx.body = {
        status: 200,
        result: { subscriptions: data[0] ? data[0].count : 0 }
      }
    })
  })

  router.get('/list', async ctx => {
    let { limit = 30, offset = 0 } = ctx.request.query
    let where = {}

    limit = parseInt(limit)
    offset = parseInt(offset)

    try {
      let { rows, count } = await models.User.findAndCountAll({
        where,
        limit,
        offset: limit * offset
      })

      ctx.body = {
        status: 200,
        result: {
          user: rows,
          tital: count
        }
      }
    } catch (e) {
      ctx.body = {
        status: 500,
        message: 'User list error: ' + e.message
      }
    }
  })
}
