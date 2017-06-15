import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import { actionStorageMiddleware, createStorageListener } from 'redux-state-sync'
import promiseMiddleware from 'redux-promise'
import createReducer from './reducers'

//
import { apiMiddleware } from './middlewares/apiCall'
import { errorMiddleware } from './middlewares/apiError'

const initStore = initialState => {
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const middlewares = [ promiseMiddleware, thunk, apiMiddleware, errorMiddleware ]

  if (typeof window !== 'undefined') {
    middlewares.push(actionStorageMiddleware)
  }

  const store = createStore(createReducer(), initialState, composeEnhancers(
    applyMiddleware(...middlewares)
  ))

  typeof window !== 'undefined' && createStorageListener(store)

  store.asyncReducers = {}

  return store
}

export const injectAsyncReducer = (store, name, asyncReducer) => {
  store.asyncReducers[name] = asyncReducer
  store.replaceReducer(createReducer(store.asyncReducers))
}

export default initStore
