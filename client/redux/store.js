// import thunk from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { actionStorageMiddleware, createStorageListener } from 'redux-state-sync'
import promiseMiddleware from 'redux-promise'

// reducers
import auth from './auth'
import access from './error'
import profile from './profile'

// default reducer
const exampleInitialState = {}
const index = (state = exampleInitialState, action) => {
  switch (action.type) {
    default: return state
  }
}

// combine reducers
let combinedReducer = combineReducers({
  auth,
  access,
  profile,
  index
})

export default (initialState = exampleInitialState) => {
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const store = createStore(combinedReducer, initialState, composeEnhancers(
    applyMiddleware(promiseMiddleware, actionStorageMiddleware)
  ))

  typeof window !== 'undefined' && createStorageListener(store)
  return store
  // return createStore(combinedReducer, initialState)
}
