import { createStore, applyMiddleware, compose } from 'redux'
import { actionStorageMiddleware, createStorageListener } from 'redux-state-sync'

const exampleInitialState = {
  posts: []
}

export const actionTypes = {
  AUTH: 'AUTH',
  LOGOUT: 'LOGOUT',
  LOAD_POSTS: 'LOAD_POSTS',
  ADD_POST: 'ADD_POST'
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
    case actionTypes.LOAD_POSTS:
      return {
        ...state,
        posts: action.payload.posts
      }
    case actionTypes.ADD_POST:
      return {
        ...state,
        posts: [action.payload.post, ...state.posts]
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

export const loadPosts = posts => ({
  type: actionTypes.LOAD_POSTS,
  payload: {
    posts
  }
})

export const addPost = post => ({
  type: actionTypes.ADD_POST,
  payload: {
    post
  }
})

export const initStore = (initialState = exampleInitialState) => {
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const middlewares = [actionStorageMiddleware]
  const store = createStore(reducer, initialState, composeEnhancers(
    applyMiddleware(...middlewares)
  ))
  typeof window !== 'undefined' && createStorageListener(store)
  return store
}
