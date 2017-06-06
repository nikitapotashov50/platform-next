import axios from 'axios'

import { generateFetchActions } from '../../utils/redux'
import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {
  items: [],
  count: [],
  verified: []
}

export const { startFetch, endFetch } = generateFetchActions('volunteer/tasks')

export const getTotalCount = createAction('volunteer/tasks/GET_COUNT', async (params, options = {}) => {
  options.params = params
  options.withCredentials = true
  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/volunteer/tasks/count`, options)
<<<<<<< HEAD
=======

>>>>>>> 4be3b2a01a129e6a936ce5befb5943ae3fb39761
  if (data.status === 200) return data.result
})

export const getNotVerified = createAction('volunteer/tasks/LOAD', async (params, options = {}) => {
  options.params = params
  options.withCredentials = true

  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/volunteer/tasks/list`, options)

  if (data.status === 200) return data.result
})

<<<<<<< HEAD
export const verifyTask = createAction(`/volunteer/tasks/TASK_VERIFY`, async (replyId, type) => {
  let { data } = await axios.put(`${BACKEND_URL}/api/mongo/volunteer/tasks/${replyId}/${type}`, { type })
  console.log(data)
=======
export const verifyTask = createAction('/volunteer/tasks/TASK_VERIFY', async (replyId, type) => {
>>>>>>> 4be3b2a01a129e6a936ce5befb5943ae3fb39761
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
  })
}, defaultState)
