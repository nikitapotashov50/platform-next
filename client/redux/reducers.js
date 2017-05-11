import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'
import {
  loadPosts,
  addPost,
  loadMore
} from './actions'

import auth from './auth'
import error from './error'
import profile from './profile'

export const initialState = {
  posts: []
}

const defaultReducer = handleActions({
  [loadPosts]: (state, action) => ({
    ...state,
    posts: action.payload
  }),
  [addPost]: (state, action) => ({
    ...state,
    posts: [action.payload, ...state.posts]
  }),
  [loadMore]: (state, action) => ({
    ...state,
    posts: [...state.posts, ...action.payload]
  })
}, initialState)

export default combineReducers({
  auth,
  error,
  profile
})