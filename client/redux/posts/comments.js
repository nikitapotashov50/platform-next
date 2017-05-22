import axios from 'axios'
import { omit } from 'lodash'
import { fetchPosts } from '../posts'
import { handleActions, createAction } from 'redux-actions'

/** default */
const defaultState = {
  // items contains all comments, received from database at the moment
  // items sctructured by post_id
  items: {},
  // fetching will indicate which post is processing now
  fetching: null,
  // added is for newly added comments. It's an object, with the keys representing post ids, containing array of added commtents ids
  added: {}
}

/** comment actions */

// add comment
export const add = createAction('comments/COMMENT_ADD', async (content, postId) => {
  const { data } = await axios.post(`/api/post/${postId}/comment`, { content })

  return { postId, comment: data.result.comment }
})

// remove comment
export const remove = createAction('comments/COMMENT_REMOVE', async (id, postId) => {
  let { data } = await axios.delete(`/api/post/${postId}/comment/${id}`)

  return data.status === 200 ? { id } : {}
})

// load more comments
export const loadMore = createAction('comments/COMMENTS_LIST_MORE', async idArray => {
  let params = { idArray: idArray.join(',') }
  let { data } = await axios.get('/api/post/comments', { params })

  return { comments: data.result.comments }
})

export const reduce = createAction('comments/COMMENTS_LIST_REDUCE', ids => ({ ids }))

// toggle fetch
export const fetchStart = createAction('comments/FETCH_START', id => ({ id }))
export const fetchEnd = createAction('comments/FETCH_END')

/** reducer */
export default handleActions({
  [add]: (state, { payload }) => ({
    ...state,
    items: {
      ...state.items,
      [payload.comment.id]: payload.comment
    },
    added: {
      ...state.added,
      [payload.postId]: [
        ...(state.added[payload.postId] || []),
        payload.comment.id
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
      ...payload.comments
    }
  }),
  [reduce]: (state, { payload }) => ({
    ...state,
    items: { ...omit(state.items, payload.ids) }
  }),
  [remove]: (state, { payload }) => ({
    ...state,
    items: { ...omit(state.items, payload.id) }
  })
}, defaultState)
