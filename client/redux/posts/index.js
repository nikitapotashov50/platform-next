import axios from 'axios'
import { pick } from 'lodash'
import { handleActions, createAction } from 'redux-actions'

/** default state  */
export const defaultState = {
  posts: [],
  votes: {},
  replies: {},
  query: {},
  total: 0,
  voted: [],
  fething: false
}

/** posts fetching actions */
export const fetchPosts = createAction('posts/LOAD_MORE', async (params = {}, options = {}) => {
  options.params = params
  options.withCredentials = true
  const { data } = await axios.get(`${BACKEND_URL}/api/mongo/posts`, options)

  return {
    ...data.result,
    offset: params.offset || 0
  }
})

/** clear post list */
export const clearList = createAction('posts/POSTS_LIST_CLEAR')

/** toggle fetching flag */
export const endListFetch = createAction('posts/POSTS_LIST_FETCH_END')
export const startListFetch = createAction('posts/POSTS_LIST_FETCH_START')

/** update query to post list */
export const queryUpdate = createAction('posts/POSTS_LIST_QUERY_UPDATE', (query, rewrite = false) => ({ query, rewrite }))

/** posts add actions */
export const addPost = createAction('posts/POST_ADD', async post => {
  let { data } = await axios.post(`/api/mongo/posts`, post, { withCredentials: true })

  return {
    users: data.result.users,
    posts: [ { ...data.result.posts, added: true } ]
  }
})

/** edit post */
export const updatePost = createAction('posts/UPDATE_POST', async (id, data) => {
  data = pick(data, [ 'title', 'content' ])

  await axios.put(`/api/mongo/posts/${id}`, data, { withCredentials: true })

  return { _id: id, data }
})

/** Post removal */
export const deletePost = createAction('posts/POST_DELETE', async id => {
  await axios.delete(`/api/mongo/posts/${id}`, {}, { withCredentials: true })
  return id
})

// reducer functions
const toggleFetchFlag = (state, flag) => ({
  ...state,
  fetching: flag
})

// resucer
export default handleActions({
  [fetchPosts]: (state, { payload }) => ({
    ...state,
    posts: [
      // тут добавляем посты в конец списка
      ...(payload.offset ? state.posts : []),
      ...(payload.posts || [])
    ],
    replies: {
      ...(payload.offset ? state.replies : {}),
      ...(payload.replies || {})
    },
    votes: {
      ...(payload.votes ? state.votes : {}),
      ...(payload.votes || {})
    },
    voted: [
      ...(payload.voted ? state.voted : []),
      ...(payload.voted || [])
    ],
    total: payload.total,
    offset: payload.offset
  }),
  [addPost]: (state, { payload }) => ({
    ...state,
    posts: [
      // тут добавляем пост в начало списка
      ...payload.posts,
      ...state.posts
    ]
  }),
  [endListFetch]: state => toggleFetchFlag(state, false),
  [startListFetch]: state => toggleFetchFlag(state, true),
  [queryUpdate]: (state, { payload }) => ({
    ...state,
    query: {
      ...(payload.rewrite ? {} : state.query),
      ...payload.query
    }
  }),
  [clearList]: state => ({ ...state, posts: [] }),
  [deletePost]: (state, action) => ({
    ...state,
    posts: state.posts.filter(post => post._id !== action.payload)
  }),
  [updatePost]: (state, action) => ({
    ...state,
    posts: state.posts.map(post => {
      if (post._id === action.payload._id) return { ...post, ...action.payload.data }
      return post
    })
  })
}, defaultState)
