import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {
  items: null,
  current: null
}

//
export const fill = createAction('user/programs/FILL_PROGRAMS', array => {
  let items = {}
  let current = array[0].id

  array.map(el => { items[el.id] = el })
  return { items, current }
})

//
export const add = createAction('user/programs/ADD_PROGRAMS', item => ({ [item.id]: item }))

// change current program
export const changeCurrent = createAction('user/programs/CHANGE_PROGRAM', id => ({ id }))

export default handleActions({
  [fill]: (state, { payload }) => ({
    ...state,
    items: payload.items,
    current: payload.current
  }),
  [add]: (state, { payload }) => ({
    ...state,
    items: {
      ...state.items,
      ...payload.item
    }
  }),
  [changeCurrent]: (state, { payload }) => ({
    ...state,
    current: payload.id
  })
}, defaultState)
