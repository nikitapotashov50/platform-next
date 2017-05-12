const qs = require('query-string')
const axios = require('axios')
const config = require('../../config')

const isUserAuthOnBM = async (user, hash, userAgent) => {
  try {
    let { data } = await axios.post('http://api.molodost.bz/oauth/token/', {
      grant_type: 'user_hash',
      user: user,
      hash: hash,
      user_agent: userAgent,
      client_id: config.bmapi.client_id,
      client_secret: config.bmapi.client_secret
    })

    return data.access_token
  } catch ({ response }) {
    throw new Error('BM Api: ' + response.data.error + ' – ' + response.data.error_description)
  }
}

const getBMAccessToken = async (username, password) => {
  try {
    const { data } = await axios.post('http://api.molodost.bz/oauth/token/', {
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
