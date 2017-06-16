import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

const defaultState = {
  info: {}
}

export const getTask = createAction('task/GET_TASK', async (taskId, options) => {
  console.log('12312312312')
  let prefix = ''
  let params = { withCredentials: true }
  if (options.headers) {
    prefix = BACKEND_URL
    params.headers = options.headers
  }

  let { data } = await axios.get(`${prefix}/api/mongo/tasks/${taskId}`, params)
  console.log(data)
  return data.status === 200 ? data.result : data
})

export default handleActions({
  [getTask]: (state, { payload }) => payload.task ? { ...payload.task, replyType: payload.replyType } : null
}, defaultState)
