import { createAction } from 'redux-actions'

export const generateFetchActions = prefix => ({
  fetchEnd: createAction(`${prefix}/FETCH_END`),
  fetchStart: createAction(`${prefix}/FETCH_START`)
})
