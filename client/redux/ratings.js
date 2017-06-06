import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'
import { server } from '../../config'

export const defaultState = {
  ratings: [],
  speakers: []
}

export const loadRatings = createAction('ratings/LOAD_RATINGS', async params => {
  const { data } = await axios.get(`http://${server.host}:${server.port}/api/rating/${params.tab || 'all'}/${params.program}/${params.id}`)
  return data
})

export const loadSpeakers = createAction('ratings/LOAD_SPEAKERS', async params => {
  const { data } = await axios.get(`http://${server.host}:${server.port}/api/rating/speakers/${params.program}`)
  return data.score
})

export const searchUsers = createAction('ratings/SEARCH_USERS', async params => {
  const { data } = await axios.get(`http://${server.host}:${server.port}/api/rating/search/${params.program}/${params.searchInput}/0`)
  return data
})

export const loadMore = createAction('ratings/SEARCH_USERS_MORE', async params => {
  const { data } = await axios.get(`http://${server.host}:${server.port}/api/rating/search/${params.program}/${params.searchInput}/${params.offset}`)
  return data
})

export default handleActions({
  [loadRatings]: (state, action) => ({
    ...state,
    ratings: action.payload
  }),
  [loadSpeakers]: (state, action) => ({
    ...state,
    speakers: action.payload
  }),
  [searchUsers]: (state, action) => ({
    ...state,
    ratings: action.payload
  }),
  [loadMore]: (state, action) => ({
    ...state,
    ratings: [...state.ratings, ...action.payload]
  })
}, defaultState)
