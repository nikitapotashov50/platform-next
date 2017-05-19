import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

export const defaultState = {
  posts: []
}

export const addPost = createAction('posts/ADD_POST')
export const loadPosts = createAction('posts/LOAD_POSTS')
export const loadMore = createAction('posts/LOAD_MORE', async params => {
  console.log(params)
  const { data } = await axios.get('/api/post', { params })
  return data
})

export const deletePost = createAction('posts/DELETE', async id => {
  try {
    await axios.delete(`/api/post/${id}`)
    return id
  } catch (e) {
    return e
  }
})

export const addLike = createAction('posts/ADD_LIKE', async id => {
  const { data } = await axios.post(`/api/post/${id}/like`)
  return { ...data, post_id: id }
})

export const removeLike = createAction('posts/REMOVE_LIKE', async id => {
  const { data } = await axios.delete(`/api/post/${id}/like`)
  return { ...data, post_id: id }
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
  },
  [addLike]: (state, action) => {
    const postId = action.payload.post_id
    const posts = state.posts.map(post => {
      return post.id === postId ? {
        ...post,
        likes: [...post.likes, action.payload],
        liked: true
      } : post
    })
    return {
      ...state,
      posts
    }
  },
  [removeLike]: (state, action) => {
    const postId = action.payload.post_id
    const posts = state.posts.map(post => {
      return post.id === postId ? {
        ...post,
        likes: post.likes.filter(like => like.id !== action.payload.id),
        liked: false
      } : post
    })
    return {
      ...state,
      posts
    }
  }
}, defaultState)
