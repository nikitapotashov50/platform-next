import axios from 'axios'
import { createAction } from 'redux-actions'

export const auth = createAction('AUTH')

export const logout = createAction('LOGOUT')

export const loadPosts = createAction('LOAD_POSTS')

export const addPost = createAction('ADD_POST')

export const loadMore = createAction('LOAD_MORE', async offset => {
  const { data } = await axios.get('/api/post', {
    params: {
      offset
    }
  })

  return data
})

export const deletePost = createAction('DELETE', async id => {
  await axios.delete(`/api/post/${id}`)
})
