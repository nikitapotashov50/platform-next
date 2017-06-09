const { models, orm } = require('../models')
const mongoose = require('mongoose')
const _ = require('lodash')
const ProgressBar = require('progress')

const migrateSubscriptions = async ctx => {
  let users = await mongoose.models.Users.find().populate('meta')

  await Promise.all(users.map(async user => {
    return new Promise(async (resolve, reject) => {
      let subs = await models.User.findAll({
        attributes: [ 'id' ],
        include: [
          {
            required: true,
            attributes: [],
            as: 'Subscribers',
            model: models.User,
            where: { id: user.meta.migration_id }
          }
        ]
      })

      subs = subs.map(el => el.id)
      let subsObj = await mongoose.models.UsersMeta.find({
        'migration_id': { $in: subs }
      })

      let ids = subsObj.map(el => el.userId)

      user.subscriptions = ids
      await user.save()

      resolve()
    })
  }))

  return 200
}

const migrateCities = async ctx => {
  let cities = await models.City.findAll({
    attributes: [ 'id', 'name' ]
  })

  let bar = new ProgressBar(':bar', { total: cities.length })

  await Promise.all(cities.map(el => {
    return new Promise(async (resolve, reject) => {
      let data = {
        name: el.name || 'Не указан',
        migration_id: el.id
      }

      let city = new mongoose.models.City(data)
      await city.save()

      bar.tick()

      resolve()
    })
  }))

  bar.tick()

  return 200
}

const migrateGroups = async ctx => {
  ctx.log.info('Start fetching groups')

  await mongoose.models.Group.remove()
  await mongoose.models.GameGroup.remove()
  await mongoose.models.CoachGroup.remove()

  let groups = await models.Group.findAll({
    include: [
      {
        as: 'Programs',
        required: false,
        model: models.Program,
        attributes: [ 'id' ]
      }
    ]
  })
  let count = groups.length
  let bar = new ProgressBar(':bar', { total: groups.length })

  while (count--) {
    bar.tick()
    let group = groups.shift()

    let mongoData = _.pick(group, [ 'title', 'money', 'total_score', 'migration_id' ])
    mongoData = _.extend(mongoData, { enabled: group.is_blocked, created: group.created_at })

    // достаем программы
    mongoData.programs = (group.Programs || []).map(el => el.id)

    // достаем пользователей
    let users = await models.User.findAll({
      attributes: [ 'id' ],
      include: [
        {
          as: 'Groups',
          required: true,
          attributes: [],
          model: models.Group,
          where: {
            id: group.id
          }
        }
      ]
    })

    let userIds = users.map(el => el.id)
    let mongoUsers = await mongoose.models.UsersMeta.find({
      migration_id: { $in: userIds }
    })
    mongoData.users = mongoUsers.map(el => el.userId)

    // достаем лидера
    let leader = await mongoose.models.UsersMeta.findOne({
      migration_id: group.leader_id
    })
    if (!leader) {
      let title = group.title.split(' ')
      let lastName = title.pop()
      let firstName = title.pop()

      let tryLeaders = await mongoose.models.Users.find({
        first_name: firstName,
        last_name: lastName
      })

      if (tryLeaders.length && tryLeaders.length === 1) leader = tryLeaders[0]
      // if (tryLeaders.length && tryLeaders.length > 1) ctx.log.info(tryLeaders)
    }

    if (leader) mongoData.leader = leader.userId

    try {
      let newGroup = await mongoose.models.Group.create(mongoData)

      if (group.type) {
        if (group.type === 'game') {
          let gameGroup = await models.GameGroup.findOne({
            where: { group_id: group.id }
          })

          if (gameGroup) {
            let groupType = await mongoose.models.GameGroupType.findOne({ code: gameGroup.type })
            let mongoGroupType = await mongoose.models.GameGroup.create({ type: groupType, groupId: newGroup._id })
            newGroup.specific = { type: 'GameGroup', item: mongoGroupType._id }
            await newGroup.save()
          }
        }
        if (group.type === 'coach') {
          let mongoGroupType = await mongoose.models.CoachGroup.create({ groupId: newGroup._id })
          newGroup.specific = { type: 'CoachGroup', item: mongoGroupType._id }
          await newGroup.save()
        }
      }
    } catch (e) {
      ctx.log.info(`Error saving group ${e}`)
    }
  }
  bar.tick()
  if (bar.complete) ctx.log.info('completed')

  return 200
}

const migrateUsers = async ctx => {
  ctx.log.info('Users fetching start')

  let users = await models.User.findAll({})
  let bar = new ProgressBar(':bar', { total: users.length })

  await mongoose.models.Users.remove()
  await mongoose.models.UsersInfo.remove()
  await mongoose.models.UsersMeta.remove()
  await mongoose.models.ProgramUserMeta.remove()

  await Promise.all(users.map(async user => {
    return new Promise(async (resolve, reject) => {
      let mongoData = _.pick(user, [ 'name', 'email', 'last_name', 'first_name', 'picture_small', 'picture_small' ])
      mongoData.locale = user.locale || 'ru'
      mongoData.role = 1

      let mongoUser = new mongoose.models.Users(mongoData)
      await mongoUser.save()

      let uInfo = _.pick(user, [ 'phone', 'vk', 'facebook', 'instagram', 'website', 'about', 'hobbies', 'birthday', 'gender' ])
      mongoUser.updateInfo(uInfo)

      let uMeta = _.extend(_.pick(user, [ 'timezone', 'remote_ip', 'uid', 'molodost_id' ]), { migration_id: user.id })
      await mongoUser.updateMeta(uMeta)

      let goals = await models.Goal.findAll({
        attributes: [ 'a', 'b', 'occupation', 'is_closed', 'created_at', 'category', 'id', 'user_id' ],
        where: {
          user_id: user.id
        }
      })

      await Promise.all(goals.map(goal => {
        return new Promise(async (resolve, reject) => {
          let add = {
            closed: goal.is_closed,
            created: goal.created_at
          }
          goal = _.pick(goal, [ 'a', 'b', 'occupation', 'category' ])

          try {
            await mongoUser.addGoal(goal, add)
          } catch (e) {
            ctx.log.info(`Error on goal save ${user.id}, ${e}`)
          }
          resolve()
        })
      }))

      let programsRoles = await models.UserProgramRole.findAll({
        where: { user_id: user.id }
      })

      programsRoles = programsRoles.reduce((obj, item) => {
        obj[item.program_id] = item.program_role_id ? item.program_role_id : 3
        return obj
      }, {})

      let programMeta = await models.UserProgram.findAll({
        where: { user_id: user.id }
      })

      await Promise.all(programMeta.map(program => {
        return new Promise(async (resolve, reject) => {
          let data = {
            price: program.price,
            is_activated: program.is_activated,
            activated_at: program.activated_at
          }

          let city = await mongoose.models.City.findOne({
            migration_id: program.city_id || 1
          })
          data.cityId = city._id
          await mongoUser.addProgram(program.program_id, data, programsRoles[program.program_id])

          resolve()
        })
      }))

      bar.tick()
      resolve()
    })
  }))

  return 200
}

const migratePosts = async ctx => {
  ctx.log.info('Posts fetching start')

  let offset = 0
  let count = await orm.query('SELECT count(*) AS count FROM `posts`')
  count = JSON.parse(JSON.stringify(count))[0][0].count
  let bar = new ProgressBar(':bar', { total: count })

  await mongoose.models.Post.remove()
  await mongoose.models.Comment.remove()
  await mongoose.models.Like.remove()
  await mongoose.models.Attachment.remove()

  while (true) {
    let posts = await models.Post.findAll({
      limit: 1000,
      offset: 1000 * offset
    })

    if (!posts) break
    offset = offset + 1

    await Promise.all(posts.map((post, i) => {
      return new Promise(async (resolve, reject) => {
        let userIds = [ post.user_id ]

        let programs = await models.Program.findAll({
          attributes: [ 'id' ],
          include: [
            {
              attributes: [],
              required: true,
              where: { id: post.id },
              model: models.Post
            }
          ]
        })

        programs = programs.map(el => el.id)
        // console.log(programs)

        let comments = await models.Comment.findAll({
          attributes: [ 'post_id', 'user_id', 'id', 'content', 'is_blocked', 'created_at' ],
          where: {
            post_id: post.id
          }
        })

        comments = comments.map(el => {
          userIds.push(el.user_id)
          return _.pick(el, [ 'post_id', 'user_id', 'id', 'content', 'is_blocked', 'created_at' ])
        })

        let attachments = await models.Attachment.findAll({
          attributes: [ 'name', 'path', 'created_at' ],
          include: [
            {
              required: true,
              attributes: [],
              model: models.Post,
              where: {
                id: post.id
              }
            }
          ]
        })
        attachments = attachments.map(el => _.pick(el, [ 'name', 'path', 'created_at' ]))

        let likes = await models.Like.findAll({
          attributes: [ 'id', 'user_id', 'created_at' ],
          include: [
            {
              required: true,
              as: 'Posts',
              attributes: [],
              model: models.Post,
              where: {
                id: post.id
              }
            }
          ]
        })

        likes = likes.map(el => {
          userIds.push(el.user_id)
          return _.pick(el, [ 'user_id', 'id', 'created_at' ])
        })

        // ctx.log.info({ post: post.id, likes, comments })

        let users = await mongoose.models.UsersMeta.find({
          migration_id: { $in: userIds || [] }
        })
        users = users.reduce((obj, item) => {
          obj[item.migration_id] = item.userId
          return obj
        }, {})

        let postData = {
          title: post.title,
          content: post.content,
          created: post.created_at,
          updated: post.updated_at,
          program: programs,
          enabled: !post.is_blocked
        }

        let newPost
        try {
          newPost = await mongoose.models.Post.addPost(postData, { user: users[post.user_id] })
        } catch (e) {
          ctx.log.info(`error in post ${post.id}, ${e}`)
        }

        await Promise.all(attachments.map(attachment => {
          return new Promise(async (resolve, reject) => {
            let add = {
              created: attachment.created_at
            }

            try {
              ctx.log.info(`attachment ${attachment}`)
              await newPost.addAttachment(_.pick(attachment, [ 'name', 'path' ]), add)
            } catch (e) {
              ctx.log.info(`error in attachment ${post.id}, ${e}`)
            }
            resolve()
          })
        }))

        await Promise.all(comments.map(comment => {
          return new Promise(async (resolve, reject) => {
            let add = {
              created: comment.created_at,
              enabled: !comment.is_blocked
            }

            try {
              await newPost.addComment(comment.content, users[comment.user_id], add)
            } catch (e) {
              ctx.log.info(`error in comment ${post.id}, ${comment.user_id}, ${e}`)
            }
            resolve()
          })
        }))

        await Promise.all(likes.map(like => {
          return new Promise(async (resolve, reject) => {
            let add = {
              created: like.created_at
            }

            try {
              await newPost.addLike(users[like.user_id], add)
            } catch (e) {
              ctx.log.info(`error in like ${post.id}, ${like.user_id}`)
            }
            resolve()
          })
        }))

        bar.tick()
        resolve()
      })
    }))
  }

  return 200
}

module.exports = {
  migrateCities,
  migrateUsers,
  migratePosts,
  migrateGroups,
  migrateSubscriptions
}
