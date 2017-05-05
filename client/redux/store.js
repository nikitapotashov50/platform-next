import axios from 'axios'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

const exampleInitialState = {
  count: 0
}

export const actionTypes = {
  AUTH: 'AUTH',
  LOGOUT: 'LOGOUT'
}

// REDUCERS
export const reducer = (state = exampleInitialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH:
      return {
        ...state,
        user: action.payload.user
      }
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null
      }
    default: return state
  }
}

// ACTIONS
export const auth = user => ({
  type: actionTypes.AUTH,
  payload: { user }
})

export const logout = () => ({
  type: actionTypes.LOGOUT
})

export const initStore = (initialState = exampleInitialState) => {
  return createStore(reducer, initialState)
}
