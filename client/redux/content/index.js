import axios from 'axios'

import { generateFetchActions } from '../../utils/redux'
import { handleActions, createAction } from 'redux-actions'

//
const defaultState = {
  items: [],
  fetching: false
}

/** ------------------ fetching ------------------- */
export const { fetchStart, fetchEnd } = generateFetchActions('content')

/** ------------------ get list ------------------- */
export const getContent = createAction('content/GET_LIST', async (params = {}, options = {}) => {
  options.params = params
  options.withCredentials = true
  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/content/list`, options)
  return data.result
})

export default handleActions({
  [getContent]: (state, { payload }) => ({
    ...state,
    items: payload.items
  })
  [fetchEnd]: state => ({ ...state, fetching: false }),
  [fetchStart]: state => ({ ...state, fetching: true })
}, defaultState)
