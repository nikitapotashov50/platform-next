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
  } catch ({ response }) {
    throw new Error('BM Api: ' + response.data.error + ' – ' + response.data.error_description)
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
  } catch ({ response }) {
    throw new Error('BM Api: ' + response.data.error + ' – ' + response.data.error_description)
  }
}

module.exports = {
  getBalance,
  createWallet
}
