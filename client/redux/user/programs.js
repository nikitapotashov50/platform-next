import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

import { refresh, auth, logout } from '../auth'

// default state
let defaultState = {
  items: {},
  current: null
}

//
export const fill = createAction('user/programs/FILL_PROGRAMS', array => {
  let items = {}
  let current = array.length ? array[0].id : null

  array.map(el => { items[el.id] = el })
  return { items, current }
})

//
export const add = createAction('user/programs/ADD_PROGRAMS', item => ({ [item.id]: item }))

// change current program
export const changeCurrent = createAction('user/programs/CHANGE_PROGRAM', async programId => {
  await axios.put('/api/mongo/me/program/changeCurrent', { programId }, { withCredentials: true })

  return { id: programId }
})

const fillPrograms = (state, payload = {}) => {
  let current
  let items = (payload.programs || []).reduce((acc, item) => {
    acc[item._id] = item
    if (item.alias === 'default') current = item._id
    return acc
  }, {})

  return {
    ...state,
    current: payload.program || current,
    items: {
      ...state.items,
      ...items
    }
  }
}

export default handleActions({
  [refresh]: (state, { payload }) => fillPrograms(state, payload),
  [auth]: (state, { payload }) => ({ ...state, current: payload.currentProgram }),
  [add]: (state, { payload }) => ({
    ...state,
    items: {
      ...state.items,
      ...payload.item || {}
    }
  }),
  [changeCurrent]: (state, { payload }) => ({
    ...state,
    current: payload.id
  }),
  [logout]: state => ({
    ...defaultState
  })
}, defaultState)
