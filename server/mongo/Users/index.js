const mongoose = require('mongoose')
const { extend, isArray, uniq, pick, isObject } = require('lodash')
const { is } = require('../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  last_name: { type: String, default: '' },
  first_name: { type: String, default: '' },
  //
  picture_small: { type: String, default: '' },
  picture_large: { type: String, default: '' },
  //
  locale: { type: String, default: 'ru' },
  //
  role: { type: Number, ref: 'UserRole' },
  info: { type: ObjectId, ref: 'UsersInfo' },
  meta: { type: ObjectId, ref: 'UsersMeta' },
  //
  programs: [ {
    meta: { type: ObjectId, ref: 'ProgramUserMeta' },
    roleId: { type: Number, ref: 'ProgramRoles' },
    programId: { type: Number, ref: 'Program' }
  } ],
  goals: [ { type: ObjectId, ref: 'Goal' } ],
  subscriptions: [ { type: ObjectId, ref: 'Users' } ]
}, is))

model.index({ 'name': 1, 'email': 1 }, { unique: true })

model.virtual('subscriptionsCount').get(function () {
  return this.subscriptions.length
})

model.statics.UsersInfo = require('./info')
model.statics.UsersMeta = require('./meta')
model.statics.UserRoles = require('./roles')

model.statics.getShortInfo = async function (idArray) {
  let model = this
  if (!isArray(idArray)) idArray = [ idArray ]

  let params = {
    _id: { $in: uniq(idArray) }
  }

  let list = await model
    .find(params)
    .select('_id first_name last_name picture_small name goals')
    .populate({
      path: 'goals',
      match: { closed: false },
      options: {
        limit: 1,
        sort: { created: -1 }
      }
    })

  return list.map(user => {
    let refUser = pick(user, [ '_id', 'first_name', 'last_name', 'picture_small', 'name' ])
    refUser.occupation = user.goals[0] ? user.goals[0].occupation : ''
    return refUser
  })
}

/** add program to user */
model.methods.addProgram = async function (programId, options, roleId = 3) {
  let user = this

  let meta = await mongoose.models.ProgramUserMeta.makeMeta(programId, user._id, options)

  user.programs.addToSet({ programId, roleId, meta })
  await user.save()

  return user
}

model.methods.updateMeta = async function (data) {
  let user = this
  let meta = await mongoose.models.UsersMeta.getOrCreate(user._id, data)

  if (user.meta) return user

  user.meta = meta
  await user.save()

  return user
}

model.methods.updateInfo = async function (data) {
  let user = this
  let info = await mongoose.models.UsersInfo.getOrCreate(user._id)

  await info.update(data)

  if (!user.meta) {
    user.info = info
    await user.save()
  }

  return user
}

model.methods.addGoal = async function (data, add) {
  let user = this
  let goal = await mongoose.models.Goal.addToUser(user._id, data, add)

  user.goals.addToSet(goal)
  await user.save()

  return user
}

model.methods.getSubscribers = async function (limit = null) {
  let user = this
  let params = {
    subscriptions: { $in: [ user._id ] }
  }

  let query = mongoose.models.Users.find(params).select('name first_name last_name picture_small')

  if (limit) query.limit(Number(limit))

  let list = await query.exec()
  let total = await mongoose.models.Users.count(params).exec()

  return { list, total }
}

model.methods.getGroups = async function (limit = null) {
  let user = this
  let params = {
    users: { $in: [ user._id ] }
  }

  let query = mongoose.models.Group.find(params).select('title _id')

  if (limit) query.limit(Number(limit))

  let list = await query.exec()
  let total = await mongoose.models.Group.count(params).exec()

  return { list, total }
}

model.methods.addSubscription = async function (subscription) {
  let user = this
  user.subscriptions.addToSet(subscription)

  await user.save()

  return user
}

model.methods.removeSubscription = async function (subscription) {
  let user = this
  let subId = subscription._id || subscription

  let index = user.subscriptions.indexOf(subId)
  if (index !== -1) user.subscriptions.splice(index, 1)

  await user.save()

  return user
}

model.methods.getSessionInfo = function () {
  return pick(this, [ '_id', 'last_name', 'first_name', 'picture_small', 'name' ])
}

module.exports = mongoose.model('Users', model)
