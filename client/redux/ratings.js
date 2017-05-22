import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'
import { server } from '../../config'

export const defaultState = {
  ratings: [],
  speakers: []
}

export const loadRatings = createAction('ratings/LOAD_RATINGS', async (tab, program, userId) => {
  const trailingParams = userId ? `${program}/${userId}` : program
  const { data } = await axios.get(`http://${server.host}:${server.port}/api/rating/${tab || 'all'}/${trailingParams}`)
  return data
})

export const loadSpeakers = createAction('ratings/LOAD_SPEAKERS', async program => {
  const { data } = await axios.get(`http://${server.host}:${server.port}/api/rating/speakers/${program}`)
  return data.score
})

export default handleActions({
  [loadRatings]: (state, action) => ({
    ...state,
    ratings: action.payload
  }),
  [loadSpeakers]: (state, action) => ({
    ...state,
    speakers: action.payload
  })
}, defaultState)
