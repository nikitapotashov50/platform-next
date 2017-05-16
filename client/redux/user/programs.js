import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {}

//
export const fill = createAction('user/programs/FILL_PROGRAMS', array => {
  let items = {}
  array.map(el => { items[el.id] = el })
  return { items }
})

// change current program
export const changeCurrent = createAction('user/programs/CHANGE_PROGRAM', id => ({ id }))

export default handleActions({
  [fill]: (state, { payload }) => ({
    ...state,
    items: payload.items
  }),
  [changeCurrent]: (state, { payload }) => ({
    ...state,
    current: payload.id
  })
}, defaultState)
