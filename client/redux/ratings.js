import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'
import { server } from '../../config'

export const defaultState = {
  ratings: []
}

export const loadRatings = createAction('ratings/LOAD_RATINGS', async (tab, program, userId) => {
  const trailingParams = userId ? `${program}/${userId}` : program
  const { data } = await axios.get(`http://${server.host}:${server.port}/api/rating/${tab || 'all'}/${trailingParams}`)
  return data
})

export default handleActions({
  [loadRatings]: (state, action) => ({
    ratings: action.payload
  })
}, defaultState)
