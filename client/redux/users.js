import { handleActions, createAction } from 'redux-actions'

import { fetchPosts, addPost } from './posts'
import { loadMore, add } from './posts/comments'
import { getNotVerified } from './volunteer/tasks'

import { API_CONST } from './middlewares/apiCall'

const defaultState = {}

const searchActions = {
  start: 'users/search/FETCH_START',
  success: 'users/search/FETCH_SUCCESS',
  fail: 'users/search/FETCH_FAIL'
}

export const searchUsers = createAction(API_CONST, (params, options = {}) => ({
  method: 'get',
  params: params,
  url: '/api/mongo/users/list',
  options: { ...options, withCredentials: true },
  actions: [ searchActions.start, searchActions.success, searchActions.fail ]
}))

const reduceUsers = (state, payload) => ({
  ...state,
  ...(payload.users || {})
})

export default handleActions({
  [getNotVerified]: (state, { payload }) => reduceUsers(state, payload),
  [fetchPosts]: (state, { payload }) => reduceUsers(state, payload),
  [addPost]: (state, { payload }) => reduceUsers(state, payload),
  [loadMore]: (state, { payload }) => reduceUsers(state, payload),
  [add]: (state, { payload }) => reduceUsers(state, payload)
}, defaultState)
