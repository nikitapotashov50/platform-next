const mongoose = require('mongoose')
const { extend } = require('lodash')
const { is } = require('../utils/common')
const { addTokensByAction } = require('../../controllers/tokenController')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  userId: { type: ObjectId, ref: 'Users', required: true },
  weight: { type: Number, default: 0 },
  target: {
    model: { type: String },
    item: { type: ObjectId, refPath: 'target.model' }
  }
}, is))

model.statics.findPostLike = async function (postId, userId) {
  let like = await this.findOne({ userId, 'target.item': postId, 'target.model': 'Post' })
  return like
}

model.statics.addToPost = async function (postId, userId, add = {}, postInfo = {}) {
  let like = await this.findPostLike(postId, userId)

  if (!like) {
    like = await this.create(extend({
      userId,
      target: { model: 'Post', item: postId }
    }, add))

    if (postInfo.authorId && (postInfo.authorId !== userId)) like.addWeight(postInfo.authorId, userId, postId)
  } else if (!like.enabled) {
    like.enabled = true
    await like.save()
  }
  // todo обработку ошибок
  return like
}

model.statics.removeFromPost = async function (postId, userId) {
  let model = this
  let like = await model.findPostLike(postId, userId)

  like.enabled = false
  await like.save()
  // todo обработку ошибок
  return like
}

model.methods.addWeight = async function (authorId, userId, postId) {
  let like = this
  try {
    let result = await addTokensByAction(authorId, 'votePost', { userFrom: userId, model: 'Post', item: postId })
    if (!result.success) throw new Error('Token not successful')
    like.weight = result.data.amount

    await Promise.all([
      like.save(),
      mongoose.models.Post.addWeight(postId, result.data.amount)
    ])
  } catch (e) {
    console.log(e)
  }
}

module.exports = mongoose.model('Like', model)
