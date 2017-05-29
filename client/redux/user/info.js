import axios from 'axios'

import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {}

export const loadInfo = createAction('user/info/LOAD', async () => {
  let { data } = await axios.get('/api/mongo/me/edit')
  if (data.status === 200) return data.result
})

export const updateInfo = createAction('auth/UPDATE_INFO', async affectedData => {
  let { data } = await axios.put('/api/mongo/me/edit', affectedData, { withCredentials: true })
  if (data.status === 200) return data.result
})

export default handleActions({
  [loadInfo]: (state, { payload }) => ({
    ...(payload.info || {})
  }),
  [updateInfo]: (state, { payload }) => ({
    ...state,
    ...(payload.info || {})
  })
}, defaultState)
