import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'
import { generateFetchActions } from '../../utils/redux'

const defaultState = {
  active: [],
  replied: [],
  knife: [],
  count: null,
  fetching: false
}

//
export const { fetchEnd, fetchStart } = generateFetchActions('tasks')

export const getActiveCount = createAction('tasks/GET_COUNT', async (options = {}) => {
  let prefix = ''
  options.withCredentials = true
  if (options.headers) prefix = BACKEND_URL

  let { data } = await axios.get(`${prefix}/api/mongo/tasks/count`, options)

  return data.result
})

export const getTasks = createAction('tasks/GET_LIST', async (programId, type, options = {}) => {
  let params = {
    params: { programId },
    withCredentials: true
  }

  let prefix = ''
  let postfix = type !== 'current' ? type : ''

  if (options.headers) {
    prefix = BACKEND_URL
    params.headers = options.headers
  }

  let { data } = await axios.get(`${prefix}/api/mongo/tasks/${postfix}`, params)

  if (data.result) {
    return {
      active: data.result.active || [],
      replied: data.result.replied || [],
      knife: data.result.knife || []
    }
  } else return data
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
  }),
  [fetchEnd]: state => ({ ...state, fetching: false }),
  [fetchStart]: state => ({ ...state, fetching: true })
}, defaultState)
