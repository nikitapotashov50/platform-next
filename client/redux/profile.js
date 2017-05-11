// import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {
  user: null
}

// actions
const GET_INFO = 'profile/GET_INFO'
const NOT_FOUND = 'profile/NOT_FOUND'

// action creators
export const getUserInfo = createAction('profile/GET_INFO', user => ({ user }))
export const userNotFound = createAction('profile/NOT_FOUND')

// reducer

export default handleActions({
  [getUserInfo]: (state, action) => ({
    ...state,
    user: action.payload.user
  }),
  [userNotFound]: (state, action) => ({
    ...state,
    user: null
  })
}, defaultState)
