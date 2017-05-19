import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

export const defaultState = {
  posts: [],
  users: {},
  comments: {},
  fething: false,
  offset: 0
}

// posts fetching actions
export const fetchPosts = createAction('posts/LOAD_MORE', async (params, serverPath = '', isInitial = false) => {
  let apiPath = serverPath + '/api/post'
  const { data } = await axios.get(apiPath, { params })

  return {
    ...data.result,
    offset: params.offset || 0
  }
})

export const clearPosts = createAction('posts/CLEAR_POST')
export const startFetchPosts = createAction('posts/FETCH_START')

export const setOffset = createAction('posts/SET_OFFSET')

// posts add actions
export const addPost = createAction('posts/ADD_POST')
export const deletePost = createAction('posts/DELETE', async id => {
  await axios.delete(`/api/post/${id}`)
  return id
})
export const addUsers = createAction('posts/ADD_POST')

// post interactions
export const addLike = createAction('posts/ADD_LIKE', async id => {
  const { data } = await axios.post(`/api/post/${id}/like`)
  return { ...data, post_id: id }
})

export const removeLike = createAction('posts/REMOVE_LIKE', async id => {
  const { data } = await axios.delete(`/api/post/${id}/like`)
  return { ...data, post_id: id }
})

export const addComment = createAction('posts/ADD_COMMENT')

// resucer
export default handleActions({
  [fetchPosts]: (state, action) => ({
    ...state,
    posts: [
      ...state.posts,
      ...action.payload.posts
    ],
    users: {
      ...state.users,
      ...(action.payload.users || {})
    },
    fetching: false,
    offset: action.payload.offset
  }),
  [clearPosts]: state => ({
    ...state,
    posts: []
  }),
  [startFetchPosts]: state => ({
    ...state,
    fetching: true
  }),
  [addPost]: (state, action) => {
    const post = { ...action.payload, comments: [], likes: [] }
    return {
      ...state,
      posts: [post, ...state.posts]
    }
  },
  [addUsers]: (state, { payload }) => ({
    ...state,
    users: {
      ...state.users,
      ...payload.users
    }
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
