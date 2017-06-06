import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

const defaultState = {
  active: [],
  replied: [],
  knife: [],
  count: null
}

export const getActiveCount = createAction('tasks/GET_COUNT', async (options = {}) => {
  options.withCredentials = true
  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/tasks/count`, options)

  return data.result
})

export const getTasks = createAction('tasks/GET_LIST', async (programId, type, options = {}) => {
  let params = {
    params: { programId },
    withCredentials: true
  }
  let postfix = type !== 'current' ? type : ''

  if (options.headers) params.headers = options.headers
  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/tasks/${postfix}`, params)

  if (data.result) {
    return {
      active: data.result.active || [],
      replied: data.result.replied || [],
      knife: data.result.knife || []
    }
  } else {
    console.log(data)
    return data
  }
})

export default handleActions({
  [getActiveCount]: (state, { payload }) => ({
    ...state,
    count: payload.count
  }),
  [getTasks]: (state, { payload }) => ({
    ...state,
    active: payload.active || [],
    replied: payload.replied || [],
    knife: payload.knife || []
  })
}, defaultState)
