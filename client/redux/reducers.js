import { handleActions } from 'redux-actions'
import {
  auth,
  logout,
  loadPosts,
  addPost,
  loadMore
} from './actions'

export const initialState = {
  posts: []
}

export default handleActions({
  [auth]: (state, action) => ({
    ...state,
    user: action.payload
  }),
  [logout]: (state, action) => ({
    ...state,
    user: null
  }),
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
