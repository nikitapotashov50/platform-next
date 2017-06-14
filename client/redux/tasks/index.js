import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'
import { generateFetchActions } from '../../utils/redux'

import { API_CONST } from '../middlewares/apiCall'

const defaultState = {
  active: [],
  knife: [],
  count: null,
  fetching: false
}

const FETCH_START = 'tasks/FETCH_START'
const FETCH_SUCCESS = 'tasks/FETCH_SUCCESS'
const FETCH_FAIL = 'tasks/FETCH_FAIL'

//
export const tasksApiGet = createAction(API_CONST, (programId, type = 'current', options = {}) => {
  let prefix = ''
  let postfix = type !== 'current' ? type : ''
  options.withCredentials = true
  if (options.headers) prefix = BACKEND_URL

  return {
    options,
    params: { programId },
    url: `${prefix}/api/mongo/tasks/${postfix}`,
    method: 'get',
    actions: [ FETCH_START, FETCH_SUCCESS, FETCH_FAIL ]
  }
})

export const { fetchEnd, fetchStart } = generateFetchActions('tasks')

export const getActiveCount = createAction('tasks/GET_COUNT', async (options = {}) => {
  let prefix = ''
  options.withCredentials = true
  if (options.headers) prefix = BACKEND_URL

  let { data } = await axios.get(`${prefix}/api/mongo/tasks/count`, options)

  return data.result
})

// export const getTasks = createAction('tasks/GET_LIST', async (programId, type, options = {}) => {
//   let params = {
//     params: { programId },
//     withCredentials: true
//   }

//   let prefix = ''
//   let postfix = type !== 'current' ? type : ''

//   if (options.headers) {
//     prefix = BACKEND_URL
//     params.headers = options.headers
//   }

//   let { data } = await axios.get(`${prefix}/api/mongo/tasks/${postfix}`, params)

//   if (data.result) {
//     return {
//       active: data.result.active || [],
//       replied: data.result.replied || [],
//       knife: data.result.knife || []
//     }
//   } else return data
// })

export default handleActions({
  [getActiveCount]: (state, { payload }) => ({
    ...state,
    count: payload.count
  }),
  [FETCH_SUCCESS]: (state, { payload }) => ({
    ...state,
    active: payload.active || [],
    knife: payload.knife || [],
    fetching: false
  }),
  [FETCH_FAIL]: state => ({
    ...state,
    knife: [],
    active: [],
    fetching: false
  }),
  [FETCH_START]: state => ({ ...state, fetching: true })
}, defaultState)
