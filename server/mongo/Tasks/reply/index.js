const mongoose = require('mongoose')
const { extend, pick } = require('lodash')
const { is } = require('../../utils/common')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  title: { type: String, required: true },
  content: { type: String, required: true },
  //
  userId: { type: ObjectId, ref: 'Users' },
  postId: { type: ObjectId, ref: 'Posts' },
  taskId: { type: ObjectId, ref: 'Tasks' },
  replyTypeId: { type: Number, ref: 'TaskReplyTypes' }
}, is))

model.statics.ReplyTypes = require('./type')

model.statics.initDefaults = async function (defaults) {
  let model = this

  await Promise.all(defaults.map(reply => {
    return new Promise(async (resolve, reject) => {
      let user = await mongoose.models.Users.findOne({ name: reply.userName })
      let task = await mongoose.models.Task.findOne()
      console.log(task)

      let data = pick(reply, [ 'title', 'content' ])
      await model.create(extend(data, {
        userId: user._id,
        taskId: task._id
      }))
      resolve()
    })
  }))
}

module.exports = mongoose.model('TaskReply', model)
