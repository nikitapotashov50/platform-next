import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

/** default */
const defaultState = {
  items: [],
  fetching: null
}

/** actions */
const manageLike = async (id, action = 'post') => {
  const { data } = await axios[action](`/api/post/${id}/like`)
  return data
}

// add like to post
export const addLike = createAction('posts/ADD_LIKE', async id => {
  await manageLike(id, 'post')
  return { id }
})

// remove like to post
export const removeLike = createAction('posts/REMOVE_LIKE', async id => {
  await manageLike(id, 'delete')
  return { id }
})

/** reducer */
export default handleActions({
  [addLike]: (state, { p }) => ({
    ...state,
    items: [
      ...state.items,
      p.id
    ]
  }),
  // todo доделать
  [removeLike]: (state, action) => {
    let tmp = { ...state.items }
    return {
      ...state,
      items: tmp
    }
  }
}, defaultState)
