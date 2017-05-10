// default state
let defaultState = {
  error: null,
  message: null
}

// actions
const ALLOW = 'error/ALLOW'
const RESTRICTED = 'error/RESTRICTED'

// action creators
export const restrictAccess = (message) => ({
  type: RESTRICTED,
  payload: { message }
})

export const allowAccess = () => ({
  type: ALLOW
})

// reducer
export default (state = defaultState, action) => {
  switch (action.type) {
    case RESTRICTED:
      return {
        ...state,
        error: 403,
        message: action.payload.message
      }
    case ALLOW:
      return {
        ...state,
        error: null
      }
    default: return state
  }
}
