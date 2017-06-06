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

<<<<<<< HEAD
export const getTasks = createAction('tasks/GET_LIST', async (programId, type, options = {}) => {
=======
export const getTasks = createAction('tasks/GET_LIST', async (programId, options = {}) => {
>>>>>>> 4be3b2a01a129e6a936ce5befb5943ae3fb39761
  let params = {
    params: { programId },
    withCredentials: true
  }
<<<<<<< HEAD
  let postfix = type !== 'current' ? type : ''

  if (options.headers) params.headers = options.headers
  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/tasks/${postfix}`, params)
=======
  console.log(params)
  if (options.headers) params.headers = options.headers

  let { data } = await axios.get(BACKEND_URL + '/api/mongo/tasks', params)
>>>>>>> 4be3b2a01a129e6a936ce5befb5943ae3fb39761

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
