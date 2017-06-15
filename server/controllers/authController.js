const formEncode = require('form-urlencoded')
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

    return data
  } catch ({ response }) {
    throw new Error('BM Api: ' + response.data.error + ' – ' + response.data.error_description)
  }
}

const getProgramCity = async (userId, bmProgramId, accessToken) => {
  try {
    let { data } = await axios.get(`http://api.molodost.bz/api/v3/entry-set-user/city/?entry_set_id=${bmProgramId}&user_id=${userId}`, {
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

const getBMProgramById = async (userId, bmProgramId, accessToken) => {
  try {
    let { data } = await axios.get(`http://api.molodost.bz/api/v3/user/entry-set/has-access/?entry_set_id=${bmProgramId}&user_id=${userId}`, {
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

const refreshToken = async token => {
  try {
    let { data } = await axios.post('http://api.molodost.bz/oauth/token/', {
      refresh_token: token,
      grant_type: 'refresh_token',
      client_id: config.bmapi.client_id,
      client_secret: config.bmapi.client_secret
    })

    return data
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
    return data
  } catch ({ response }) {
    throw new Error('BM Api: ' + response.data.error + ' – ' + response.data.error_description)
  }
}

const getBMSignUp = async (email, firstname, lastname, accessToken) => {
  firstname = toString(firstname).replace(/[^A-Za-zА-Яа-яЁё]/g, '')
  lastname = toString(lastname).replace(/[^A-Za-zА-Яа-яЁё]/g, '')

  try {
    let { data } = await axios.post('http://api.molodost.bz/api/v3/auth/register/', formEncode({ firstname, lastname, email }), {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    })

    return data
  } catch ({ response }) {
    throw new Error('BM Api: ' + response.data.error + ' – ' + response.data.error_description)
  }
}

const getBMRecovery = async (email, accessToken) => {
  try {
    let { data } = await axios.post('http://api.molodost.bz/api/v3/auth/password/restore/', formEncode({ email }), {
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
  refreshToken,
  getBMRecovery,
  isUserAuthOnBM,
  getBMAccessToken,
  getBMProgramById,
  getProgramCity,
  getBMAccessTokenCredentialsOnly
}
