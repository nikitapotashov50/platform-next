// import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {
  user: null,
  groups: [],
  subscriptions: [],
  subscribers: []
}

// action creators
export const getUserInfo = createAction('profile/GET_INFO', ({ user, groups, subscriptions, subscribers }) => ({ user, groups, subscriptions, subscribers }))
export const userNotFound = createAction('profile/NOT_FOUND')

// reducer

export default handleActions({
  [getUserInfo]: (state, { payload }) => ({
    ...state,
    user: payload.user,
    groups: payload.groups || [],
    subscribers: payload.subscribers || [],
    subscriptions: payload.subscriptions || []
  }),
  [userNotFound]: (state, action) => ({
    ...defaultState
  })
}, defaultState)
