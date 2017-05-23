import axios from 'axios'
import { uniq, remove } from 'lodash'
import { handleActions, createAction } from 'redux-actions'

import { fetchPosts } from '../posts/index'

/** default */
const defaultState = {
  posts: []
}

/** actions */
const manageLike = async (id, action = 'post') => {
  const { data } = await axios[action](`/api/post/${id}/like`)
  return data
}

// add like to post
export const addLike = createAction('likes/POST_LIKE_ADD', async id => {
  manageLike(id, 'post')
  return { id }
})

// remove like to post
export const removeLike = createAction('likes/POST_LIKE_REMOVE', async id => {
  manageLike(id, 'delete')
  return { id }
})

/** reducer */
export default handleActions({
  [addLike]: (state, { payload }) => ({
    ...state,
    posts: [
      ...state.posts,
      payload.id
    ]
  }),
  // todo доделать
  [removeLike]: (state, { payload }) => {
    let tmp = [ ...(state.posts || []) ]
    remove(tmp, n => n === payload.id)

    return {
      ...state,
      posts: tmp
    }
  },
  // fetch likes form posts result
  [fetchPosts]: (state, { payload }) => ({
    ...state,
    posts: uniq([
      ...state.posts,
      ...(payload.liked || [])
    ])
  })
}, defaultState)
