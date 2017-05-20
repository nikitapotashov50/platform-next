import axios from 'axios'
import qs from 'query-string'
import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {
  items: [],
  cities: [],
  limit: 40,
  count: null
}

// action creators
export const getNpsEntries = createAction('admin/nps/GET_ENTRIES', async ({ type }, { limit, page }) => {
  let offset = page - 1
  let { data } = await axios.get('https://platform.molodost.bz/api/feedback?' + qs.stringify({ type, limit, offset }))

  return {
    items: data.nps,
    count: data.count
  }
})

export const getNpsCities = createAction('admin/nps/GET_CITIES', async ({ type }) => {
  let { data } = await axios.get('https://platform.molodost.bz/api/feedback/cities?' + qs.stringify({ type }))

  return {
    items: data.cities
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
