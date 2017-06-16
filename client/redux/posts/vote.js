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
  actions: [ actions.start, actions.success, actions.fail ]
}))

export const changeValue = createAction('posts/voting/ON_CHANGE', (field, value) => ({ field, value }))

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
      [payload.field]: payload.value
    }
  }),
  //
  [actions.start]: state => ({ ...state, fetching: true }),
  [actions.success]: (state, { payload }) => ({
    ...state,
    result: payload,
    success: true,
    fetching: false
  }),
  [actions.fail]: state => ({
    ...state,
    success: false,
    fetching: false
  })
}, initialState)
