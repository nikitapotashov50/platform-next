const mongoose = require('mongoose')
const moment = require('moment')
const { extend, pick } = require('lodash')
const { created } = require('../utils/common')

const { getBalance, createWallet } = require('../../controllers/tokenController')

const ObjectId = mongoose.Schema.Types.ObjectId

const model = new mongoose.Schema(extend({
  timezone: { type: Number },
  radar_id: { type: Number },
  radar_access_token: { type: String },
  remote_ip: { type: String, default: null },
  uid: { type: String, default: null },
  migration_id: { type: Number },
  //
  molodost_id: { type: Number },
  molodost_access: { type: String },
  molodost_refresh: { type: String },
  token_expires: { type: Date },
  //
  wallet: { type: String, default: null },
  //
  userId: { type: ObjectId, ref: 'Users', required: true, unique: true }
}, created))

model.index({ 'userId': 1 }, { unique: true })

model.statics.getOrCreate = async function (userId, data = {}) {
  let model = this
  let meta = await model.findOne({ userId })
  if (!meta) meta = await model.create({ userId })

  meta = extend(meta, data)
  meta = await meta.save()

  return meta
}

model.methods.update = async function (data) {
  let _self = this
  _self = extend(_self, pick(data, [ 'timezone', 'remote_ip', 'uid', 'migration_id', 'molodost_id' ]))
  return _self.save()
}

model.methods.updateToken = function (BMAccess) {
  let _self = this
  _self = extend(_self, {
    molodost_access: BMAccess.access_token,
    molodost_refresh: BMAccess.refresh_token,
    token_expires: moment().add(BMAccess.expires_in, 's').toISOString()
  })
  return _self.save()
}

model.methods.getWallet = async function () {
  let meta = this
  if (meta.wallet) return meta
  let wallet, response

  response = await getBalance(meta.molodost_id)
  console.log(response)
  if (!response.success) {
    let [ user ] = await mongoose.models.Users.find({ _id: meta.userId }).limit(1)
    response = await createWallet(meta.molodost_id, user.email, {})
    if (response.success) wallet = response.data.account.waddress || true
  } else wallet = response.data.user.waddress || true

  if (wallet) meta.wallet = wallet

  return meta.save()
}

module.exports = mongoose.model('UsersMeta', model)
