import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

const defaultState = {
  info: {},
  status: {}
}

export const getReply = createAction('task/reply/GET_REPLY', async (taskId, options) => {
  let params = { withCredentials: true }
  if (options.headers) params.headers = options.headers

  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/myTasks/${taskId}/reply`, params)
  return data.result
})

export const postReply = createAction('task/reply/POST_REPLY', async (taskId, content) => {
  let { data } = await axios.post(BACKEND_URL + `/api/mongo/myTasks/${taskId}/reply`, content, { withCredentials: true })

  return data.result
})

export default handleActions({
  [getReply]: (state, { payload }) => ({
    ...state,
    info: payload.reply || null,
    status: payload.status || null
  }),
  [postReply]: (state, { payload }) => ({
    ...state,
    info: payload.reply || null,
    status: null
  })
}, defaultState)
