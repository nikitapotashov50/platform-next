import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

const defaultState = {
  info: {},
  status: {},
  specific: null,
  fetching: false
}

/** --------------------- */

export const getReply = createAction('task/reply/GET_REPLY', async (taskId, options) => {
  let params = { withCredentials: true }
  if (options.headers) params.headers = options.headers

  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/tasks/${taskId}/reply`, params)
  return data.result
})

export const postReply = createAction('task/reply/POST_REPLY', async (taskId, content) => {
  let { data } = await axios.post(BACKEND_URL + `/api/mongo/tasks/${taskId}/reply`, content, { withCredentials: true })
  return data.result
})

/** --------------------- */

export const fetchStart = createAction('task/reply/FETCH_START')
export const fetchEnd = createAction('task/reply/FETCH_END')

/** --------------------- */

const getReducer = (state, payload) => {
  return {
    ...state,
    info: payload.reply || null,
    status: payload.status || null,
    specific: payload.specific || null
  }
}

export default handleActions({
  [getReply]: (state, { payload }) => getReducer(state, payload),
  [postReply]: (state, { payload }) => getReducer(state, payload),
  [fetchStart]: state => ({ ...state, fetching: true }),
  [fetchEnd]: state => ({ ...state, fetching: false })
}, defaultState)
