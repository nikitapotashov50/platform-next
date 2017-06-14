import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {
  error: null,
  message: null,
  inlineError: null
}

// action creators
export const restrictAccess = createAction('error/RESTRICTED', message => ({ message }))
export const allowAccess = createAction('error/ALLOW')

//
export const dismissError = createAction('error/DISMISS')
export const dispatchError = createAction('error/DISPATCH', ({ status, message }) => ({ status, message }))

// reducer
export default handleActions({
  [restrictAccess]: (state, action) => ({
    ...state,
    error: 403,
    message: action.payload.message
  }),
  [allowAccess]: (state, action) => ({
    ...defaultState
  }),
  [dismissError]: state => ({
    ...state,
    inlineError: null
  }),
  [dispatchError]: (state, { payload }) => ({
    ...state,
    inlineError: payload
  })
}, defaultState)
