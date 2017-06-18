import axios from 'axios'
import qs from 'query-string'
import { pick } from 'lodash'
import { handleActions, createAction } from 'redux-actions'

import { API_CONST } from '../middlewares/apiCall'

// default state
let defaultState = {
  items: [],
  count: null,
  filters: {},
  total: {},
  query: { limit: 40, page: 1 }
}

const filterActions = [ 'admin/nps/FILTER_FETCH_START', 'admin/nps/FILTER_FETCH_SUCCESS', 'admin/nps/FILTER_FETCH_FAIL' ]
const totalActions = [ 'admin/nps/TOTAL_FETCH_START', 'admin/nps/TOTAL_FETCH_SUCCESS', 'admin/nps/TOTAL_FETCH_FAIL' ]
const entriesActions = [ 'admin/nps/ENTRIES_FETCH_START', 'admin/nps/ENTRIES_FETCH_SUCCESS', 'admin/nps/ENTRIES_FETCH_FAIL' ]

// action creators
export const getFilters = createAction(API_CONST, async (type, options = {}) => ({
  method: 'get',
  params: { type },
  url: `/api/mongo/nps/filters`,
  options: { ...options, withCredentials: true },
  actions: filterActions
}))

export const updateQuery = createAction('admin/nps/GET_FILTERS', (query = {}, rewrite = false) => ({ query, rewrite }))

export const getTotal = createAction(API_CONST, async (type, options = {}) => ({
  method: 'get',
  params: { type },
  url: `/api/mongo/nps/stats`,
  options: { ...options, withCredentials: true },
  actions: totalActions
}))

export const getNpsEntries = createAction(API_CONST, async (type, { limit, page }, options = {}) => ({
  method: 'get',
  params: { page, limit, type },
  url: `/api/mongo/nps/entries`,
  options: { ...options, withCredentials: true },
  actions: entriesActions
}))

export const getNpsCities = createAction('admin/nps/GET_CITIES', async ({ type }) => {
  let { data } = await axios.get(`${BACKEND_URL}/api/feedback/cities?${qs.stringify({ type })}`)

  return {
    items: data.cities
  }
})

// reducer
export default handleActions({
  [entriesActions[1]]: (state, { payload }) => ({
    ...state,
    items: payload.items || [],
    count: payload.total || 0
  }),
  [totalActions[1]]: (state, { payload }) => ({
    ...state,
    total: pick((payload.data || [])[0] || {}, [ 'result', 'byDate' ])
  }),
  [updateQuery]: (state, { payload }) => ({
    ...state,
    query: payload.rewrite ? payload.query : { ...state.query, ...payload.query }
  }),
  [filterActions[1]]: (state, { payload }) => ({
    ...state,
    filters: payload.filters
  })
}, defaultState)
