const axios = require('axios')
const config = require('../../config')
const { extend } = require('lodash')
const { models } = require('mongoose')

const getBalance = async (userId) => {
  try {
    let { data } = await axios.get('http://api.bmml.ru/api/v1/account/' + userId + '/', {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + config.bmtoken.secret
      }
    })

    return data
  } catch (err) {
    console.log(err)
    throw new Error('Token Api error')
  }
}

const createWallet = async (userId, email, add = {}) => {
  try {
    let request = extend({ id: userId, email }, add)
    let { data } = await axios.post('http://api.bmml.ru/api/v1/account/create/', request, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + config.bmtoken.secret
      }
    })

    return data
  } catch (error) {
    console.log(error)
    throw new Error('Token Api error')
  }
}

const tokenAction = async (userId, params) => {
  try {
    let { data } = await axios.post(`http://api.bmml.ru/api/v1/account/${userId}/action`, params, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + config.bmtoken.secret
      }
    })

    return data
  } catch (error) {
    throw new Error('Token Api: ' + error)
  }
}

const actions = [ 'writePost', 'writeComment', 'votePost', 'voteComment' ]
const actionsTo = [ 'votePost', 'voteComment' ]

const addTokensByAction = async (userTo, action, add = {}) => {
  if (actions.indexOf(action) === -1) throw new Error('no such action')

  let [ targetMeta ] = await models.UsersMeta.find({ userId: userTo }).limit(1)
  if (!targetMeta || !targetMeta.molodost_id) throw new Error('no user meta exists')

  if (!targetMeta.wallet) await targetMeta.getWallet()

  let response = null
  let data = {
    action,
    additionalId: targetMeta.molodost_id,
    additionaldata: { source: 'bm-platform', model: add.model, item: add.item }
  }
  //
  if (actionsTo.indexOf(action) !== -1) {
    if (!add.userFrom) throw new Error('no from user specified')
    let [ fromMeta ] = await models.UsersMeta.find({ userId: add.userFrom }).limit(1)
    if (!fromMeta || !fromMeta.molodost_id) throw new Error('no from user meta found')
    if (!fromMeta.wallet) await fromMeta.getWallet()

    response = await tokenAction(fromMeta.molodost_id, data)
  } else response = await tokenAction(targetMeta.molodost_id, data)

  console.log('response is', response)
  return response
}

module.exports = {
  getBalance,
  tokenAction,
  createWallet,
  //
  addTokensByAction
}
