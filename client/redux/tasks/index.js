import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

const defaultState = {
  active: [],
  replied: [],
  knife: []
}

export const getTasks = createAction('tasks/GET_LIST', async (programId, options = {}) => {
  let params = {
    params: { programId },
    withCredentials: true
  }

  if (options.headers) params.headers = options.headers

  let { data } = await axios.get(BACKEND_URL + '/api/mongo/tasks', params)

  return {
    active: data.result.active || [],
    replied: data.result.replied || [],
    knife: data.result.knife || []
  }
})

export default handleActions({
  [getTasks]: (state, { payload }) => ({
    active: payload.active,
    replied: payload.replied,
    knife: payload.knife
  })
}, defaultState)
