import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

export const defaultState = {
  posts: []
}

export const addPost = createAction('posts/ADD_POST')
export const loadPosts = createAction('posts/LOAD_POSTS')
export const loadMore = createAction('posts/LOAD_MORE', async offset => {
  const { data } = await axios.get('/api/post', {
    params: {
      offset
    }
  })

  return data
})

export default handleActions({
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
}, defaultState)
