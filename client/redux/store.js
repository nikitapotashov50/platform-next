import { createStore, applyMiddleware, compose } from 'redux'

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
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)|| compose
  return createStore(reducer, initialState, composeEnhancers(
    applyMiddleware()
  ))
}
