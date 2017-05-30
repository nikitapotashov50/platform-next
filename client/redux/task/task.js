import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

const defaultState = {
  info: {}
}

export const getTask = createAction('task/GET_TASK', async (taskId, options) => {
  let params = { withCredentials: true }
  if (options.headers) params.headers = options.headers

  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/myTasks/${taskId}`, params)
  return data.result
})

export default handleActions({
  [getTask]: (state, { payload }) => payload.task ? { ...payload.task, replyType: payload.replyType } : null
}, defaultState)
