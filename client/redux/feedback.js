import axios from 'axios'
import { pick } from 'lodash'
import { handleActions, createAction } from 'redux-actions'
import { generateFetchActions } from '../utils/redux'

// default state
let defaultState = {
  types: [ 'platform' ],
  reply: false,
  lastClass: null,
  fetching: false
}

// action creators

//
export const { fetchEnd, fetchStart } = generateFetchActions('feedback')

//
export const submiFeedback = createAction('feedback/SUBMIT', async (type, reply) => {
  reply = pick(reply, [ 'content', 'score' ])
  let { data } = await axios.post(`/api/mongo/feedback/rate/${type}`, reply, { withCredentials: true })

  return data.result
})

//
export const initFeedback = createAction('feedback/INIT', async (type, options = {}) => {
  options.params = { type }
  options.withCredentials = true

  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/feedback/init`, options)

  return data.result
})

// reducer
export default handleActions({
  [initFeedback]: (state, { payload }) => ({
    ...state,
    types: payload.types || [ 'platform' ],
    reply: payload.reply || false
  }),
  [submiFeedback]: (state, { payload }) => ({
    ...state,
    reply: !!payload.reply || false,
    info: payload.info || {}
  }),
  //
  [fetchEnd]: state => ({ ...state, fetching: false }),
  [fetchStart]: state => ({ ...state, fetching: true })
}, defaultState)
