import { handleActions, createAction } from 'redux-actions'
import { API_CONST } from '../middlewares/apiCall'

export const initialState = {
  data: {},
  fetching: false,
  success: null,
  result: {}
}

const actions = {
  start: 'posts/voting/VOTE_START',
  success: 'posts/voting/VOTE_SUCCESS',
  fail: 'posts/voting/VOTE_FAIL'
}

//
export const ratePost = createAction(API_CONST, (data, postId) => ({
  params: data,
  options: { withCredentials: true },
  url: `/api/mongo/posts/${postId}/rate`,
  method: 'post',
  actions: [ actions.start, actions.success ]
}))

export const changeValue = createAction('posts/voting/ON_CHANGE', (field, value, postId) => ({ field, value, postId }))

export const closeVoting = createAction('posts/voting/CLOSE')

export default handleActions({
  [closeVoting]: state => ({
    ...initialState,
    result: { ...state.result }
  }),
  //
  [changeValue]: (state, { payload }) => ({
    ...state,
    data: {
      ...state.data,
      [payload.postId]: {
        ...state.data[payload.postId],
        [payload.field]: payload.value
      }
    }
  }),
  //
  [actions.start]: state => ({ ...state, fetching: true }),
  [actions.success]: (state, { payload }) => ({
    ...state,
    result: {
      ...state.result,
      [payload.postId]: payload
    },
    success: payload.postId,
    fetching: false
  })
}, initialState)
