import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {
  error: null,
  message: null
}

// action creators
export const restrictAccess = createAction('error/RESTRICTED', message => ({ message }))
export const allowAccess = createAction('error/ALLOW')

// reducer
export default handleActions({
  [restrictAccess]: (state, action) => ({
    ...state,
    error: 403,
    message: action.payload.message
  }),
  [allowAccess]: (state, action) => ({
    ...defaultState
  })
}, defaultState)
