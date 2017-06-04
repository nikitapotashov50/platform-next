import { handleActions } from 'redux-actions'

import { fetchPosts, addPost } from './posts'
import { loadMore, add } from './posts/comments'
import { getNotVerified } from './volunteer/tasks'

const defaultState = {}

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
