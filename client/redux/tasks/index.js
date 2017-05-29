import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

const defaultState = []

export const getTasks = createAction('user/programs/FILL_PROGRAMS', async (programId) => {
  let params = { programId }
  let { data } = await axios.get(BACKEND_URL + '/api/mongo/myTasks', { params })

  return { tasks: data.result.tasks }
})

export default handleActions({
  [getTasks]: (state, { payload }) => ([
    ...state,
    ...(payload.tasks || [])
  ])
}, defaultState)
