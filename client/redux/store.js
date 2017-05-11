import { createStore, applyMiddleware, compose } from 'redux'
import { actionStorageMiddleware, createStorageListener } from 'redux-state-sync'
import promiseMiddleware from 'redux-promise'
import reducer from './reducers'

const initStore = initialState => {
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const middlewares = [promiseMiddleware]

  if (typeof window !== 'undefined') {
    middlewares.push(actionStorageMiddleware)
  }

  const store = createStore(reducer, initialState, composeEnhancers(
    applyMiddleware(...middlewares)
  ))

  typeof window !== 'undefined' && createStorageListener(store)

  return store
}

export default initStore
