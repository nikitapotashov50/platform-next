import axios from 'axios'
import qs from 'query-string'
import { pick } from 'lodash'
import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {
  items: [],
  cities: [],
  limit: 40,
  count: null,
  filters: {},
  total: {}
}

// action creators
export const getFilters = createAction('admin/nps/GET_FILTERS', async ({ type }, options = {}) => {
  options.params = { type }
  options.withCredentials = true

  return {
    programs: [
      { title: 'ЦЕХ 23', alias: 'ceh-23', _id: 1 },
      { title: 'МЗС 17', alias: 'mzs-17', _id: 2 }
    ],
    classes: [
      { _id: 1231231, title: 'Занятие 2' },
      { _id: 2133, title: 'Занятие 3' },
      { _id: 123123121231, title: 'Занятие 4' }
    ]
  }
})

export const getTotal = createAction('admin/nps/GET_TOTAL', async ({ type }, options = {}) => {
  options.params = { type }
  options.withCredentials = true

  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/nps/stats`, options)

  return data.result
})

export const getNpsEntries = createAction('admin/nps/GET_ENTRIES', async ({ type }, { limit, page }, options = {}) => {
  options.params = { offset: page - 1, limit, type }
  options.withCredentials = true
  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/nps/entries`, options)

  return {
    items: data.result.data
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
    items: payload.items
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
    total: pick((payload.data || [])[0] || {}, [ 'score_1', 'score_2', 'score_3', 'total' ]),
    count: payload.data ? payload.data.count : null
  })
}, defaultState)
