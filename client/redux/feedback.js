import { handleActions, createAction } from 'redux-actions'

import { API_CONST } from './middlewares/apiCall'

// default state
let defaultState = {
  types: [ 'platform' ],
  reply: false,
  lastClass: null,
  fetching: false
}

// action creators
const FETCH_START = 'feedback/INIT_START'
const FETCH_SUCCESS = 'feedback/INIT_SUCCESS'
const FETCH_FAIL = 'feedback/INIT_FAIL'
const SUBMIT_SUCCESS = 'feedback/SUBMIT_SUCCESS'

//
export const submiFeedback = createAction(API_CONST, async (type, reply) => {
  let options = { withCredentials: true }

  return {
    options,
    params: reply,
    url: `/api/mongo/feedback/rate/${type}`,
    method: 'post',
    actions: [ FETCH_START, SUBMIT_SUCCESS, FETCH_FAIL ]
  }
})

//
export const initFeedback = createAction(API_CONST, (type, options = {}) => {
  options.withCredentials = true

  return {
    options,
    params: { type },
    url: `/api/mongo/feedback/init`,
    method: 'get',
    actions: [ FETCH_START, FETCH_SUCCESS, FETCH_FAIL ]
  }
})

// reducer
export default handleActions({
  [FETCH_SUCCESS]: (state, { payload }) => ({
    ...state,
    types: payload.types || [ 'platform' ],
    reply: payload.reply || false,
    fetching: false
  }),
  [FETCH_START]: state => ({ ...state, fetching: true }),
  [FETCH_FAIL]: state => ({ ...defaultState }),
  [SUBMIT_SUCCESS]: (state, { payload }) => ({
    ...state,
    reply: !!payload.reply || false,
    info: payload.info || {}
  })
}, defaultState)
