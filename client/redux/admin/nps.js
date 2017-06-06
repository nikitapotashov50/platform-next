
import axios from 'axios'
import qs from 'query-string'
import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {
  items: [],
  cities: [],
  limit: 40,
  count: null,
  filters: {}
}

// action creators
export const getFilters = createAction('admin/nps/GET_FILTERS', async ({ type }, options = {}) => {
  options.params = { type }
  options.withCredentials = true
})

export const getTotal = createAction('admin/nps/GET_TOTAL', async ({ type }, options = {}) => {
  options.params = { type }
  options.withCredentials = true
})

export const getNpsEntries = createAction('admin/nps/GET_ENTRIES', async ({ type }, { limit, page }, options = {}) => {
  options.params = { offset: page - 1, limit, type }
  options.withCredentials = true
  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/nps`, options)

  return {
    items: data.nps,
    count: data.count
  }
})

export const getNpsCities = createAction('admin/nps/GET_CITIES', async ({ type }) => {
  let { data } = await axios.get(`${BACKEND_URL}/api/feedback/cities?${qs.stringify({ type })}`)

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
