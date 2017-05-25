import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {
  user: null,
  groups: [],
  subscriptions: null,
  subscribers: [],
  goal: null,
  fetching: false
}

// action creators
// export const getUserInfo = createAction('profile/GET_INFO', ({ user, groups, subscriptions, subscribers, goal }) => ({ user, groups, goal, subscriptions, subscribers }))
export const getUser = createAction('profile/GET_USER', async username => {
  let params = { username }
  let { data } = await axios.get(BACKEND_URL + '/api/users/user', { params })

  return data.status === 200
    ? data.result
    : { error: { ...data } }
})

export const getInfo = createAction('profile/GET_INFO', async id => {
  let [ groupData, subData, subscriptions ] = await Promise.all([
    new Promise(async (resolve, reject) => {
      let { data } = await axios.get(BACKEND_URL + '/api/users/user/' + id + '/groups')
      resolve(data)
    }),
    new Promise(async (resolve, reject) => {
      let { data } = await axios.get(BACKEND_URL + '/api/users/user/' + id + '/subscribers')
      resolve(data)
    }),
    new Promise(async (resolve, reject) => {
      let { data } = await axios.get(BACKEND_URL + '/api/users/user/' + id + '/subscriptions_count')
      resolve(data)
    })
  ])

  return {
    groups: groupData.result.groups,
    subscribers: subData.result.subscribers,
    subscribers_total: subData.result.subscribers_total,
    groups_total: groupData.result.groups_total,
    subscriptions: subscriptions.result.subscriptions
  }
})

export const fetchEnd = createAction('profile/FETCH_END')
export const fetchStart = createAction('profile/FETCH_START')

export const userNotFound = createAction('profile/NOT_FOUND')

// reducer

export default handleActions({
  [getUser]: (state, { payload }) => (
    payload.user
      ? { ...defaultState, user: payload.user }
      : { ...defaultState }
  ),
  [getInfo]: (state, { payload }) => ({
    ...state,
    ...payload
  }),
  [userNotFound]: (state, action) => ({
    ...defaultState
  }),
  [fetchEnd]: state => ({ ...state, fetching: false }),
  [fetchStart]: state => ({ ...state, fetching: true })
}, defaultState)
