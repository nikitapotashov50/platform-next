const mongoose = require('mongoose')
const { is } = require('../utils/common')
const { extend, isArray } = require('lodash')
const paginate = require('mongoose-paginate')
const pMap = require('p-map')

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
  //
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

  let { limit = 7, offset = 0 } = query
  limit = Number(limit)
  offset = Number(offset) + 1

  let options = {
    limit,
    lean: true,
    page: offset,
    sort: { created: -1 },
    select: '_id title content userId comments attachments likes_count',
    populate: {
      path: 'attachments',
      select: '_id path name'
    }
  }

  let data = await model.paginate(params, options)

  return { total: data.total, posts: data.docs }
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

  data.type = 0
  data.userId = user
  let post = await model.create(data)

  if (attachments && attachments.length > 0) {
    await Promise.all(attachments.map(el => {
      return mongoose.models.Attachment.addToPost(el, post, { userId: user })
    }))
  }

  return post.save()
}

model.methods.addComment = async function (content, userId, add = {}) {
  let post = this

  let data = extend({ content, userId }, add)
  let comment = await mongoose.models.Comment.addToPost(data, post._id)

  post.comments.addToSet(comment)
  await post.save()

  return comment
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

  await mongoose.models.Like.addToPost(post._id, userId, add)

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

model.methods.addAttachment = async function (data, userId, add = {}) {
  let post = this

  data = extend(data, add, userId ? { userId } : {})
  let attachment = await mongoose.models.Attachment.addToPost(data, post._id, userId)

  post.attachments.addToSet(attachment)
  await post.save()

  return post
}

model.methods.getComments = async function (offset = 0, limit = null, reversed = false) {
  let post = this
  let data = await mongoose.models.Comment.getForPost(post, { offset, limit, reversed })

  return data
}

module.exports = mongoose.model('Post', model)
