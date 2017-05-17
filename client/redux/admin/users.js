import axios from 'axios'
import qs from 'query-string'
import { handleActions, createAction } from 'redux-actions'
import { server } from '../../../config'
//
const defaultState = {
  items: [],
  limit: 30,
  offset: 0,
  total: 0
}

//
export const fill = createAction('admin/users/FILL_ITEMS', items => ({ items }))

//
export const fetchUsers = createAction('admin/users/FILL_ITEMS', async ({ offset = 0, limit = defaultState.limit, ...props }) => {
  console.log(props)
  let query = qs.stringify({ limit, offset })
  let { data } = await axios.get(`http://${server.host}:${server.port}/api/users/list?` + query)

  if (data.status === 200) {
    return {
      items: data.result.users,
      total: data.result.count
    }
  } else throw new Error('Error')
})

//
export default handleActions({
  [fill]: (state, { payload }) => ({
    ...state,
    items: payload.items
  }),
  [fetchUsers]: (state, { payload }) => ({
    ...state,
    items: payload.items,
    total: payload.total
  })
}, defaultState)
