import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

const defaultState = {
  items: [],
  total: 0,
  query: {
    limit: 30,
    offset: 0,
    search: ''
  },
  current: null
}

// export const fill = createAction('admin/users/FILL_ITEMS', items => ({ items }))

export const fetchUsers = createAction('admin/users/FILL_ITEMS', async ({ offset = 0, limit = defaultState.limit, search, ...props }, options = {}) => {
  options.params = { limit, offset, searchString: props.searchString }
  options.withCredentials = true
  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/admin/users/list`, options)

  if (data.status === 200) {
    return {
      items: data.result.users,
      total: data.result.count
    }
  } else throw new Error('Error')
})

export const queryUpdate = createAction('admin/users/UPDATE_QUERY', (query, rewrite = false) => ({ query, rewrite }))

//
export const getUserInfo = createAction('admin/user/GET_INFO', async (userId, options = {}) => {
  options.withCredentials = true
  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/admin/users/${userId}`, options)

  if (data.status === 200) {
    return { user: data.result.user }
  } else throw new Error('Error')
})

export const clearUserInfo = createAction('admin/user/CLEAR_INFO')

export const updateUserInf = createAction('admin/user/UPDATE_INFO', async (type, params, options = {}) => {
  options.withCredentials = true
  let { data } = await axios.put(`${BACKEND_URL}/api/mongo/admin/users/${params.userId}`, options)
  console.log(data)
  if (data.status === 200) {
    return {}
  }
})

export default handleActions({
  [fetchUsers]: (state, { payload }) => {
    return ({
      ...state,
      items: payload.items,
      total: payload.total
    })
  },
  [queryUpdate]: (state, { payload }) => ({
    ...state,
    query: {
      ...(payload.rewrite ? defaultState.query : state.query),
      ...payload.query
    }
  }),
  [getUserInfo]: (state, { payload }) => ({
    ...state,
    current: (payload.user || {})
  }),
  [clearUserInfo]: (state, { payload }) => ({
    ...state,
    current: null
  })
}, defaultState)
