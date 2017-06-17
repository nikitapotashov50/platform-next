const mongoose = require('mongoose')
const { is } = require('../utils/common')
const { extend, isArray, pick } = require('lodash')
const paginate = require('mongoose-paginate')
const moment = require('moment')

const { addTokensByAction } = require('../../controllers/tokenController')

const ObjectId = mongoose.Schema.Types.ObjectId

const visibilityTypes = [ 'self', 'all', 'selected', 'subscribers' ]

const model = new mongoose.Schema(extend({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  views: { type: Number, default: 0 },
  likes_count: { type: Number, default: 0 },
  //
  userId: { type: ObjectId, ref: 'Users', required: true },
  comments: [ { type: ObjectId, ref: 'Comment' } ],
  attachments: [ { type: ObjectId, ref: 'Attachment' } ],
  //
  programs: [ { type: Number, ref: 'Program' } ],
  type: { type: Number, ref: 'PostsTypes' },
  weight: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  //
  votable: { type: Boolean, default: false },
  visibility: { type: String, enum: visibilityTypes, default: 'all' }
}, is))

model.index({ 'programs': 1 })
model.index({ 'userId': 1 })

model.plugin(paginate)

model.virtual('likesList', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'target.item'
})

model.statics.PostTypes = require('./types')

model.statics.getList = async function (params = {}, query = {}) {
  let model = this
  params.enabled = true

  let { limit = 7, offset = 0 } = query
  limit = Number(limit)
  offset = Number(offset) + 1

  let sort = { pinned: -1, created: -1 }
  if (query.sort) sort = query.sort
  let cache = null
  if (query.cache) cache = query.cache

  let options = {
    limit,
    cache,
    lean: true,
    page: offset,
    sort: sort,
    select: '_id title created content userId comments attachments pinned likes_count votable',
    populate: {
      path: 'attachments',
      select: '_id path name mime'
    }
  }

  let data = await model.paginate(params, options)

  return { total: data.total, posts: data.docs }
}

model.statics.getActual = async function (params, query = {}) {
  let model = this

  let { days = 2 } = query
  delete query.days

  query.sort = { weight: -1 }
  query.cache = 120

  params.created = { $gte: new Date(moment().subtract(days, 'days').format('YYYY-MM-DD')) }

  return model.getList(params, query)
}

model.statics.addWeight = async function (postId, amount) {
  let model = this
  let [ post ] = await model.find({ _id: postId }).limit(1)
  post.weight = post.weight + amount
  await post.save()
}

model.statics.addPost = async function (data, { user, type = 'user' }) {
  let model = this
  let attachments = data.attachments || []

  if (data.attachments) delete data.attachments

  if (data.program) {
    if (!isArray(data.program)) data.program = [ data.program ]

    let programs = await mongoose.models.Program.find({
      _id: { $in: data.program.map(Number) },
      enabled: true
    })

    data.programs = programs || []
    delete data.program
  }

  let tags = []
  decodeURIComponent(data.content).replace(/(^|\W)(#[a-zа-я\d]+[\w-]*)/gi, function (i, k, j) {
    tags.push(j)
    return j
  })

  data.type = 0
  data.userId = user
  let post = await model.create(data)

  if (tags && tags.length > 0) tags.map(async tag => { await post.addTag(tag, user) })
  if (attachments && attachments.length > 0) await Promise.all(attachments.map(el => post.addAttachment(el)))

  // addTokensByAction(user._id, 'writePost', { model: 'Post', item: post._id })
  //   .then(async res => {
  //     if (res.success) {
  //       post.weight = post.weight + res.data.amount
  //       await post.save()
  //     }
  //   })

  return post
}

model.methods.updatePost = async function (data) {
  let post = this
  console.log(data)
  post = extend(post, pick(data, [ 'title', 'content' ]))

  if (data.attachments) {
    // смотрим какие есть аттачменты уже у поста
    let current = post.attachments
    // шерстим пришедшие аттачменты на предмет новы и старых
    let newly = []
    let old = []
    data.attachments.map(el => {
      if (el._id) old.push(el._id)
      else newly.push(el)
    })
    // теперь смотрим не ушбрались ли старые
    current = current.filter(el => old.indexOf(el.toString()) === -1).map(el => {
      // убираем их из поста
      post.attachments.splice(post.attachments.indexOf(el), 1)
      return el
    })

    await post.save()
    await mongoose.models.Attachment.block(current || [])

    if (newly && newly.length > 0) await Promise.all(newly.map(el => post.addAttachment(el)))
  }

  return post.save()
}

model.methods.addComment = async function (content, userId, add = {}) {
  let post = this

  let data = extend({ content, userId }, add)
  let comment = await mongoose.models.Comment.addToPost(data, post._id, { authorId: post.userId })

  post.comments.addToSet(comment)
  await post.save()

  return comment
}

model.methods.addTag = function (title, userId) {
  let post = this
  return mongoose.models.Tag.addToPost(title, post._id, userId)
}

model.methods.removeComment = async function (commentId, user) {
  let post = this
  // есть ли такой коммент в посте
  let index = post.comments.indexOf(commentId)
  if (index === -1) throw new Error('no such comment in this post')

  // найдем комментарий
  let comment = await mongoose.models.Comment.findOne({ _id: commentId })
  if (!comment) throw new Error('no such comment exists')

  // заблокируем
  // в самом комментарии есть сссылка на пост, так что можно будет потом его восстановить
  await comment.block()

  // удалим из списка в посте
  post.comments.splice(index, 1)
  await post.save()

  return post
}

model.methods.addLike = async function (userId, add = {}) {
  let post = this

  await mongoose.models.Like.addToPost(post._id, userId, add, { authorId: post.userId })

  post.likes_count = post.likes_count + 1

  return post.save()
}

model.methods.removeLike = async function (userId) {
  let post = this

  await mongoose.models.Like.removeFromPost(post._id, userId)

  post.likes_count = post.likes_count - 1
  await post.save()

  return post
}

model.methods.block = function (flag = true) {
  this.enabled = !flag
  return this.save()
}

model.methods.addAttachment = async function (data, add = {}) {
  let post = this

  data = extend(data, add, { userId: post.userId })
  let attachment = await mongoose.models.Attachment.addToPost(data, post._id)

  post.attachments.addToSet(attachment)
  return post.save()
}

model.methods.getComments = async function (offset = 0, limit = null, reversed = false) {
  let post = this
  let data = await mongoose.models.Comment.getForPost(post, { offset, limit, reversed })

  return data
}

// NPS
model.methods.addNPS = function (data, user, programId) {
  return mongoose.models.NPS.addToPost(data, user, this._id, programId)
}

model.statics.getNPS = function (postIds = [], programId) {
  return mongoose.models.NPS.aggregate([
    { $match: {
      programId: { $in: [ programId ] },
      'target.model': 'Post',
      'target.item': { $in: postIds }
    }},
    { $project: {
      _id: 1,
      target: 1,
      cityId: 1,
      programId: 1,
      created: 1,
      total: 1,
      nps: {
        $switch: {
          branches: [
            { case: { $gte: [ '$total', 9 ] }, then: 1 },
            { case: { $lte: [ '$total', 6 ] }, then: -1 }
          ],
          default: 0
        }
      }
    }},
    { $group: {
      _id: '$target.item',
      count: { $sum: 1 },
      total_arr: { $push: '$total' },
      total: { $sum: '$total' },
      total_nps: { $sum: '$nps' }
    }},
    { $project: {
      _id: 1,
      total_arr: 1,
      total: { $divide: [ '$total', '$count' ] },
      total_nps: { $divide: [ { $multiply: [ '$total_nps', 100 ] }, '$count' ] }
    }}
  ])
}

model.methods.getNPS = function (programId = null) {
  let post = this

  return mongoose.models.NPS.aggregate([
    { $match: {
      programId: { $in: programId ? [ programId ] : post.programs },
      'target.model': 'Post',
      'target.item': post._id
    }},
    { $project: {
      _id: 1,
      target: 1,
      cityId: 1,
      programId: 1,
      created: 1,
      total: 1,
      nps: {
        $switch: {
          branches: [
            { case: { $gte: [ '$total', 9 ] }, then: 1 },
            { case: { $lte: [ '$total', 6 ] }, then: -1 }
          ],
          default: 0
        }
      }
    }},
    { $group: {
      _id: null,
      count: { $sum: 1 },
      total: { $sum: '$total' },
      total_nps: { $sum: '$nps' }
    }},
    { $project: {
      _id: 0,
      total: { $divide: [ '$total', '$count' ] },
      total_nps: { $divide: [ { $multiply: [ '$total_nps', 100 ] }, '$count' ] }
    }}
  ])
}

module.exports = mongoose.model('Post', model)
