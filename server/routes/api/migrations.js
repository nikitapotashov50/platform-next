const emojiStrip = require('emoji-strip')
const { pick, some, startsWith, eq, uniq, isEmpty } = require('lodash')
const steem = require('steem')
const { models } = require('../../models')

steem.api.setWebSocket('wss://ws.platform.molodost.bz')

const moneyFromMeta = meta => {
  const metaData = JSON.parse(meta)

  if (metaData.daySumm) return Number(metaData.daySumm)
  return 0
}

const tagsFromMeta = meta => {
  const metaData = JSON.parse(meta)

  if (metaData.tags) return metaData.tags
  return []
}

module.exports = router => {
  router.get('/users', async ctx => {
    let rawUsers = await models.User.findAll({
      attributes: [ 'id', 'name' ]
    })

    let userNames = []
    let users = []

    await models.SteemUser.truncate()

    rawUsers.map(el => { userNames.push(el.name) })

    let data = await steem.api.getAccounts(userNames)

    data.map(async el => {
      let userTmp = pick(el, [ 'id', 'name', 'json_metadata' ])
      userTmp.data = JSON.parse(userTmp.json_metadata)
      userTmp.uid = userTmp.id

      delete userTmp.id
      delete userTmp.json_metadata
      users.push(userTmp)

      await models.SteemUser.create(userTmp)
    })

    ctx.body = {
      status: 200,
      result: { users }
    }
  })

  router.get('/users_refactor', async ctx => {
    let data = await models.SteemUser.findAll()
    let keys = []

    data.map(async userData => {
      userData.data = JSON.parse(userData.data)
      for (var i in userData.data) {
        keys.push(i)
      }
    })

    let userAttrNames = [
      'vk',
      // 'age',
      // 'city',
      'phone',
      'website',
      'facebook',
      'instagram',
      'last_name',
      'first_name',
      'user_image',
      'background_image',
      'i_can',
      'looking_for'
    ]

    let goalAttrNames = [
      'occupation',
      // 'target_date',
      // 'target_plan',
      'target_point_a',
      'target_point_b',
      'business_category'
    ]

    let userAttrIntersect = {
      age: 'birthday',
      user_image: 'picture_small',
      background_image: 'picture_large'
    }

    let goalAttrIntersect = {
      target_date: 'finish_at',
      target_point_a: 'a',
      target_point_b: 'b',
      business_category: 'category'
    }

    data.map(async userData => {
      let user = await models.User.findOne({
        where: {
          name: userData.name
        }
      })

      // await models.Goal.truncate()

      if (user) {
        let userAttrs = {}
        let goalAttrs = {}

        for (var k in userData.data) {
          if (userAttrNames.indexOf(k) > -1) {
            if (userAttrIntersect[k]) userAttrs[userAttrIntersect[k]] = userData.data[k]
            else userAttrs[k] = userData.data[k]
          }
          if (goalAttrNames.indexOf(k) > -1) {
            if (goalAttrIntersect[k]) goalAttrs[goalAttrIntersect[k]] = userData.data[k]
            else goalAttrs[k] = userData.data[k]
          }

          // if (userAttrs.city) {
          //   try {
          //     let city = await models.City.findOrCreate({
          //       where: {
          //         name: { $like: userAttrs.city }
          //       }
          //     })
          //     userAttrs.city_id = city[0].get('id')
          //     delete userAttrs.city
          //   } catch (e) {
          //     console.log(userAttrs.city)
          //   }
          // }
          // if (userAttrs.birthay) {
            // console.log(userAttrs.birthay)
            // userAttrs.birthay = new Date(userAttrs.birthay)
          // }
          // await user.update(userAttrs, { fields: Object.keys(userAttrs) })

          if (!isEmpty(goalAttrs) && goalAttrs.a && goalAttrs.b && goalAttrs.occupation) {
            if (typeof goalAttrs.a === 'string') goalAttrs.a = goalAttrs.a.replace(/[^0-9]+/g, '')
            goalAttrs.a = parseInt(goalAttrs.a) || 0
            if (typeof goalAttrs.b === 'string') goalAttrs.b = goalAttrs.b.replace(/[^0-9]+/g, '')
            goalAttrs.b = parseInt(goalAttrs.b) || 0

            // if (goalAttrs.finish_at) console.log(goalAttrs.finish_at)
            // if (goalAttrs.finish_at) goalAttrs.finish_at = new Date(goalAttrs.finish_at)
            let goal = await models.Goal.findOne({
              where: {
                user_id: user.get('id'),
                is_closed: 0
              }
            })

            goalAttrs.user_id = user.get('id')
            console.log(user.get('id'))

            if (goal) {
              await goal.update(goalAttrs, { fields: Object.keys(goalAttrs) })
            } else {
              await models.Goal.create(goalAttrs)
            }
          }
        }
      } else {
        console.log('eerrr', userData)
      }
    })

    ctx.body = {
      status: 200,
      result: {
        keys: uniq(keys)
      }
    }
  })

  router.get('/posts', async ctx => {
    let posts = []

    let tag = 'bm-open'
    let limit = 20
    let startPermlink, startAuthor
    let lastPost

    await models.SteemPost.truncate()

    let params = { tag, limit }

    while (true) {
      params.start_permlink = startPermlink
      params.start_author = startAuthor

      let data = await steem.api.getDiscussionsByCreated(params)

      lastPost = data.pop()

      Array.prototype.push.apply(posts, data)

      startAuthor = lastPost.author
      startPermlink = lastPost.permlink

      if (data.length < (limit - 1)) break
    }
    console.log(posts.length)
    posts.map(async post => {
      let tmp = {
        uid: post.id,
        title: post.title,
        body: emojiStrip(post.body),
        author: post.author,
        created: new Date(post.created),
        updated: new Date(post.last_update),
        permlink: post.permlink,
        meta: post.json_metadata,
        money: moneyFromMeta(post.json_metadata),
        tags: tagsFromMeta(post.json_metadata),
        isTaskReply: some(startsWith('bm-task'), tagsFromMeta(post.json_metadata)),
        isMzs: some(eq('bm-mzs17'), tagsFromMeta(post.json_metadata)),
        reblogged_by: post.reblogged_by,
        replies: post.replies,
        active_votes: post.active_votes,
        parent_permlink: post.parent_permlink
      }

      await models.SteemPost.create(tmp)
    })

    ctx.body = {
      status: 200,
      result: { posts }
    }
  })
}
