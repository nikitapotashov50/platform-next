import { createStore, applyMiddleware, compose } from 'redux'
import { actionStorageMiddleware, createStorageListener } from 'redux-state-sync'
import promiseMiddleware from 'redux-promise'
import reducer from './reducers'

export const initStore = initialState => {
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const store = createStore(reducer, initialState, composeEnhancers(
    applyMiddleware(promiseMiddleware, actionStorageMiddleware)
  ))
  typeof window !== 'undefined' && createStorageListener(store)
  return store
}
