const config = require('../config')
const axios = require('axios')

// const getBMAccessTokenCredentialsOnly = async () => {
//   let { status, statusText, data } = await axios.post(
//     'http://api.molodost.bz/oauth/token/',
//     {
//        client_id: config.bmapi.client_id,
//        client_secret: config.bmapi.client_secret,
//        grant_type: 'client_credentials'
//     }
//   )
//   return data
// }

const isUserAuthOnBM = async (user, hash, userAgent) => {
  try {
    let { data } = await axios.post('http://api.molodost.bz/oauth/token/', {
      user: user,
      hash: hash,
      user_agent: userAgent,
      client_id: config.bmapi.client_id,
      client_secret: config.bmapi.client_secret,
      grant_type: 'user_hash'
    })

    return data.access_token
  } catch ({ response }) {
    throw new Error('BM Api: ' + response.data.error + ' – ' + response.data.error_description)
  }
}

const getBMAccessToken = async (username, password) => {
  try {
    let { data } = await axios.post('http://api.molodost.bz/oauth/token/', {
      username: username,
      password: password,
      grant_type: 'password',
      client_id: config.bmapi.client_id,
      client_secret: config.bmapi.client_secret
    })

    return data
  } catch ({ response }) {
    throw new Error('BM Api: ' + response.data.error + ' – ' + response.data.error_description)
  }
}

module.exports = {
  isUserAuthOnBM,
  getBMAccessToken
  // getBMAccessTokenCredentialsOnly
}
