import axios from 'axios'
import { fetchPosts } from './index'
import { handleActions, createAction } from 'redux-actions'

/** default */
const defaultState = {
  // items contains all comments, received from database at the moment
  // items sctructured by post_id
  items: {},
  // fetching will indicate which post is processing now
  fetching: null,
  // added is for newly added comments. It's an object, with the keys representing post ids, containing array of added commtents ids
  added: {},
  opened: null
}

/** comment actions */
// open form
export const openForm = createAction('/comments/COMMENT_OPEN_FORM', postId => ({ postId }))

// add comment
export const add = createAction('comments/COMMENT_ADD', async (content, postId) => {
  const { data } = await axios.post(`/api/mongo/posts/${postId}/comments`, { content }, { withCredentials: true })
  console.log(data)
  return { postId, comment: data.result.comment, users: data.result.users }
})

// remove comment
export const remove = createAction('comments/COMMENT_REMOVE', async (id, postId) => {
  let { data } = await axios.delete(`/api/mongo/posts/${postId}/comments/${id}`, {}, { withCredentials: true })
  return data.status === 200 ? { id, postId } : {}
})

// load more comments
export const loadMore = createAction('comments/COMMENTS_LIST_MORE', async postId => {
  let params = {}
  let { data } = await axios.get(`/api/mongo/posts/${postId}/comments`, { params })

  return {
    postId,
    comments: data.result.comments
  }
})

export const reduce = createAction('comments/COMMENTS_LIST_REDUCE', (postId, number) => ({ postId, number }))

// toggle fetch
export const fetchStart = createAction('comments/FETCH_START', id => ({ id }))
export const fetchEnd = createAction('comments/FETCH_END')

/** reducer */
export default handleActions({
  [openForm]: (state, { payload }) => ({
    ...state,
    opened: payload.postId || null
  }),
  [add]: (state, { payload }) => ({
    ...state,
    items: {
      ...state.items,
      [payload.postId]: [
        ...(state.items[payload.postId] || []),
        payload.comment
      ]
    },
    added: {
      ...state.added,
      [payload.postId]: [
        ...(state.added[payload.postId] || []),
        payload.comment._id
      ]
    }
  }),
  [remove]: (state, action) => ({}),
  [fetchEnd]: state => ({
    ...state,
    fetching: null
  }),
  [fetchStart]: (state, { payload }) => ({
    ...state,
    fetching: payload.id
  }),
  [fetchPosts]: (state, { payload }) => ({
    ...state,
    items: {
      ...state.items,
      ...payload.comments
    }
  }),
  [loadMore]: (state, { payload }) => ({
    ...state,
    items: {
      ...state.items,
      [payload.postId]: [
        ...payload.comments,
        ...(state.items[payload.postId] || [])
      ]
    }
  }),
  [reduce]: (state, { payload }) => {
    let tmp = state.items[payload.postId]
    return {
      ...state,
      items: {
        ...state.items,
        [payload.postId]: [ ...(tmp.slice(tmp.length - payload.number, tmp.length)) ]
      }
    }
  },
  [remove]: (state, { payload }) => {
    let tmp = [ ...state.items[payload.postId] ]
    let index

    tmp.map((el, i) => {
      if (el._id === payload.id) index = i
    })

    tmp.splice(index, 1)

    return {
      ...state,
      items: {
        ...state.items,
        [payload.postId]: tmp
      }
    }
  }
}, defaultState)
