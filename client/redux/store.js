import { createStore, applyMiddleware, compose } from 'redux'
import { createAction } from 'redux-actions'
import { actionStorageMiddleware, createStorageListener } from 'redux-state-sync'
import promiseMiddleware from 'redux-promise'
import axios from 'axios'

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
    case 'LOAD_MORE':
      console.log('load more', action)
      return {
        ...state,
        posts: [...state.posts, ...action.payload]
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

export const loadMore = createAction('LOAD_MORE', async offset => {
  const { data } = await axios.get('/api/post', {
    params: {
      offset
    }
  })
  return data
})

export const initStore = (initialState = exampleInitialState) => {
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const store = createStore(reducer, initialState, composeEnhancers(
    applyMiddleware(promiseMiddleware, actionStorageMiddleware)
  ))
  typeof window !== 'undefined' && createStorageListener(store)
  return store
}
