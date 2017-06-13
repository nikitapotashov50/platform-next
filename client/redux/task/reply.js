import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

const defaultState = {
  info: {},
  status: {},
  specific: null,
  post: null,
  fetching: false
}

/** --------------------- */

export const getReply = createAction('task/reply/GET_REPLY', async (taskId, options) => {
  let params = { withCredentials: true }
  let prefix = ''
  if (options.headers) {
    params.headers = options.headers
    prefix = BACKEND_URL
  }

  let { data } = await axios.get(`${prefix}/api/mongo/tasks/${taskId}/reply`, params)
  return data.result
})

export const postReply = createAction('task/reply/POST_REPLY', async (taskId, content) => {
  let { data } = await axios.post(`/api/mongo/tasks/${taskId}/reply`, content, { withCredentials: true })
  return data.result
})

export const editReply = createAction('task/reply/POST_REPLY_EDIT', async (taskId, replyId, content) => {
  let { data } = await axios.put(`/api/mongo/tasks/${taskId}/reply/${replyId}`, content, { withCredentials: true })
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
    specific: payload.specific || null,
    post: payload.post || null
  }
}

export default handleActions({
  [getReply]: (state, { payload }) => getReducer(state, payload),
  [postReply]: (state, { payload }) => getReducer(state, payload),
  [editReply]: (state, { payload }) => getReducer(state, payload),
  [fetchStart]: state => ({ ...state, fetching: true }),
  [fetchEnd]: state => ({ ...state, fetching: false })
}, defaultState)
