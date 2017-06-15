const axios = require('axios')
const config = require('../../config')
const { extend } = require('lodash')

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
    // console.log(err)
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

const tokenAction = async (userId, action, targetId = null) => {
  try {
    let request = { action, targetId }
    let { data } = await axios.post(`http://api.bmml.ru/api/v1/account/${userId}/action`, request, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + config.bmtoken.secret
      }
    })

    return data
  } catch ({ response }) {
    throw new Error('Token Api: ' + response)
  }
}

module.exports = {
  getBalance,
  tokenAction,
  createWallet
}
