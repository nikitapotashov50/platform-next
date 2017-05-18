// import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {
  user: null,
  groups: [],
  subscriptions: [],
  subscribers: [],
  goal: null
}

// action creators
export const getUserInfo = createAction('profile/GET_INFO', ({ user, groups, subscriptions, subscribers, goal }) => ({ user, groups, goal, subscriptions, subscribers }))
export const userNotFound = createAction('profile/NOT_FOUND')

// reducer

export default handleActions({
  [getUserInfo]: (state, { payload }) => ({
    ...state,
    user: payload.user,
    goal: (payload.goal && payload.goal.length) ? payload.goal[0] : null,
    groups: payload.groups || [],
    subscribers: payload.subscribers || [],
    subscriptions: payload.subscriptions || []
  }),
  [userNotFound]: (state, action) => ({
    ...defaultState
  })
}, defaultState)
