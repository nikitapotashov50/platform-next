import { handleActions, createAction } from 'redux-actions'
import { logout, refresh } from '../auth'

import { API_CONST } from '../middlewares/apiCall'

const initialState = {}

const actions = [ null, 'user/goal/UPDATE_SUCCESS', null ]

export const update = createAction(API_CONST, async data => ({
  params: data,
  method: 'post',
  url: '/api/mongo/me/goal',
  options: { withCredentials: true },
  actions: actions
}))

export default handleActions({
  [actions[1]]: (state, { payload = {} }) => ({
    ...(payload.goal || [])
  }),
  [logout]: state => ({ ...initialState }),
  [refresh]: (state, { payload = {} }) => ({
    ...(payload.goal || {})
  })
}, initialState)
