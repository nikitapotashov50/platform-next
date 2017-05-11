import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {
  items: [],
  cities: [],
  limit: 40,
  count: null
}

// action creators
export const getNpsEntries = createAction('admin/nps/GET_ENTRIES', async ({ limit, page }) => {
  let offset = page - 1
  let { data } = await axios.post('http://localhost:3001/api/feedback/', { limit, offset })

  return {
    items: data.nps,
    count: data.count
  }
})

export const getNpsCities = createAction('admin/nps/GET_CITIES', async () => {
  let { data } = await axios.get('http://localhost:3001/api/feedback/cities')

  return {
    items: data.cities
  }
})

export const getNpsTotal = createAction('admin/nps/GET_TOTAL', async () => {
  let { data } = await axios.get('http://localhost:3001/api/feedback/total')

  return {
    items: data.total
  }
})

// reducer
export default handleActions({
  [getNpsEntries]: (state, { payload }) => ({
    ...state,
    items: payload.items,
    count: payload.count
  }),
  [getNpsCities]: (state, { payload }) => ({
    ...state,
    cities: payload.items
  })
}, defaultState)
