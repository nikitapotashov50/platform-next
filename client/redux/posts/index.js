import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

/** default state  */
export const defaultState = {
  posts: [],
  query: {},
  total: 0,
  fething: false
}

/** posts fetching actions */
export const fetchPosts = createAction('posts/LOAD_MORE', async (params, serverPath = '', isInitial = false) => {
  let apiPath = serverPath + '/api/mongo/posts'
  const { data } = await axios.get(apiPath, { params })

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
  let { data } = await axios.post('/api/mongo/posts', post, { withCredentials: true })

  return {
    users: data.result.users,
    posts: [ { ...data.result.posts, added: true } ]
  }
})

/** edit post */
export const updatePost = createAction('posts/UPDATE_POST', async (id, data) => {
  await axios.put(`/api/post/${id}`, {
    title: data.title,
    content: data.content
  }, {
    withCredentials: true
  })
  return {
    id,
    data
  }
})

/** Post removal */
export const deletePost = createAction('posts/POST_DELETE', async id => {
  await axios.delete(`/api/post/${id}`)
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
      ...payload.posts
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
    posts: state.posts.filter(post => post.id !== action.payload)
  }),
  [updatePost]: (state, action) => ({
    ...state,
    posts: state.posts.map(post => {
      if (post.id === action.payload.id) {
        return { ...post, ...action.payload.data }
      }
      return post
    })
  })
}, defaultState)
