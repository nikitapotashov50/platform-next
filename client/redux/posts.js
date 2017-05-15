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

export const deletePost = createAction('posts/DELETE', async id => {
  await axios.delete(`/api/post/${id}`)
  return id
})

export const addComment = createAction('posts/ADD_COMMENT')

export default handleActions({
  [loadPosts]: (state, action) => ({
    ...state,
    posts: action.payload
  }),
  [addPost]: (state, action) => {
    const post = { ...action.payload, comments: [], likes: [] }
    return {
      ...state,
      posts: [post, ...state.posts]
    }
  },
  [loadMore]: (state, action) => ({
    ...state,
    posts: [...state.posts, ...action.payload]
  }),
  [deletePost]: (state, action) => ({
    ...state,
    posts: state.posts.filter(post => post.id !== action.payload)
  }),
  [addComment]: (state, action) => {
    const postId = action.payload.post_id
    const posts = state.posts.map(post => {
      return post.id === postId ? { ...post, comments: [...post.comments, action.payload] } : post
    })
    return {
      ...state,
      posts
    }
  }
}, defaultState)
