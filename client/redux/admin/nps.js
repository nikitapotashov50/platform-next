import axios from 'axios'
import qs from 'query-string'
import { pick } from 'lodash'
import { handleActions, createAction } from 'redux-actions'
import { npsList } from '../entities/schema'
import { normalize, arrayOf } from 'normalizr'

// default state
let defaultState = {
  items: [],
  count: null,
  filters: {},
  total: {},
  query: { limit: 2, page: 1 }
}

// action creators
export const getFilters = createAction('admin/nps/GET_FILTERS', async ({ type }, options = {}) => {
  options.params = { type }
  options.withCredentials = true

  return {}
})

export const updateQuery = createAction('admin/nps/GET_FILTERS', (query = {}, rewrite = false) => ({ query, rewrite }))

export const getTotal = createAction('admin/nps/GET_TOTAL', async ({ type }, options = {}) => {
  options.params = { type }
  options.withCredentials = true

  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/nps/stats`, options)
  return data.result
})

export const getNpsEntries = createAction('admin/nps/GET_ENTRIES', async ({ type }, { limit, page }, options = {}) => {
  options.params = { page, limit, type }
  options.withCredentials = true

  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/nps/entries`, options)

  // let normal = normalize(data.result.items, npsList)
  // console.log(normal)

  return { count: data.result.total, items: data.result.items }
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
    items: payload.items || [],
    count: payload.count || 0
  }),
  [getNpsCities]: (state, { payload }) => ({
    ...state,
    cities: payload.items
  }),
  //
  [getFilters]: (state, { payload }) => ({
    ...state,
    filters: payload
  }),
  [getTotal]: (state, { payload }) => ({
    ...state,
    total: pick((payload.data || [])[0] || {}, [ 'result', 'byDate' ])
  }),
  [updateQuery]: (state, { payload }) => ({
    ...state,
    query: payload.rewrite ? payload.query : { ...state.query, ...payload.query }
  })
}, defaultState)
