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

const getMyInfo = async (accessToken) => {
  try {
    let { data } = await axios.get('http://api.molodost.bz/api/v3/user/me/', {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    })

    return data
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

const getBMAccessTokenCredentialsOnly = async () => {
  try {
    let { data } = await axios.post('http://api.molodost.bz/oauth/token/', {
      grant_type: 'client_credentials',
      client_id: config.bmapi.client_id,
      client_secret: config.bmapi.client_secret
    })
    console.log(data)
    return data
  } catch ({ response }) {
    throw new Error('BM Api: ' + response.data.error + ' – ' + response.data.error_description)
  }
}

const getBMSignUp = async (email, firstName, lastName, accessToken) => {
  firstName = toString(firstName).replace(/[^A-Za-zА-Яа-яЁё]/g, '')
  lastName = toString(lastName).replace(/[^A-Za-zА-Яа-яЁё]/g, '')
  email = toString(email)

  try {
    let { data } = await axios.post('http://api.molodost.bz/api/v3/auth/register/', {
      email,
      lastname: lastName,
      firstname: firstName
    }, {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    })

    return data
  } catch ({ response }) {
    throw new Error('BM Api: ' + response.data.error + ' – ' + response.data.error_description)
  }
}

module.exports = {
  getMyInfo,
  getBMSignUp,
  isUserAuthOnBM,
  getBMAccessToken,
  getBMAccessTokenCredentialsOnly
}
