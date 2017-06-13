import axios from 'axios'

import { generateFetchActions } from '../../utils/redux'
import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {
  items: [],
  count: [],
  verified: [],
  fetching: false,
  processing: null
}

export const { fetchStart, fetchEnd } = generateFetchActions('volunteer/tasks')

export const toggleProcessing = createAction('volunteer/tasks/PROCESSING_TOGGLE', (replyId = null) => ({ replyId }))

export const getTotalCount = createAction('volunteer/tasks/GET_COUNT', async (params, options = {}) => {
  options.params = params
  options.withCredentials = true
  let prefix = ''
  if (options.headers) prefix = BACKEND_URL

  let { data } = await axios.get(`${prefix}/api/mongo/volunteer/tasks/count`, options)
  if (data.status === 200) return data.result
})

export const getNotVerified = createAction('volunteer/tasks/LOAD', async (params, options = {}) => {
  options.params = params
  options.withCredentials = true
  let prefix = ''
  if (options.headers) prefix = BACKEND_URL

  let { data } = await axios.get(`${prefix}/api/mongo/volunteer/tasks/list`, options)

  if (data.status === 200) return data.result
})

export const verifyTask = createAction(`/volunteer/tasks/TASK_VERIFY`, async (replyId, type) => {
  await axios.put(`/api/mongo/volunteer/tasks/${replyId}/${type}`, { type }, { withCredentials: true })
  return { replyId }
})

export default handleActions({
  [getNotVerified]: (state, { payload }) => ({
    ...state,
    items: payload.tasks
  }),
  [getTotalCount]: (state, { payload }) => ({
    ...state,
    count: payload.count
  }),
  [verifyTask]: (state, { payload }) => ({
    ...state,
    verified: [ ...state.verified, payload.replyId ]
  }),
  [fetchEnd]: state => ({ ...state, fetching: false }),
  [fetchStart]: state => ({ ...state, fetching: true }),
  [toggleProcessing]: (state, { payload }) => ({ ...state, processing: payload.replyId })
}, defaultState)
