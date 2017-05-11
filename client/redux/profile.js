import axios from 'axios'

// default state
let defaultState = {
  user: null
}

// actions
const GET_INFO = 'profile/GET_INFO'
const NOT_FOUND = 'profile/NOT_FOUND'

export const test = async () => {
  let { data } = await axios.post('http://localhost:3001/api/feedback', { limit: 10, offset: 1 })

  console.log('async reducer', data.count)

  return {
    type: GET_INFO,
    payload: { user: { 123: 123 } }
  }
}

// action creators
export const getUserInfo = (user) => ({
  type: GET_INFO,
  payload: { user }
})

export const userNotFound = () => ({
  type: NOT_FOUND
})

// reducer
export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_INFO:
      return {
        ...state,
        user: action.payload.user
      }
    case NOT_FOUND:
      return {
        ...state,
        user: null
      }
    default: return state
  }
}
