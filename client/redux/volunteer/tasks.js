// import axios from 'axios'

import { handleActions } from 'redux-actions'
// createAction

// default state
let defaultState = {}

// export const getList = createAction('user/info/LOAD', async () => {
//   let { data } = await axios.get('/api/mongo/me/edit')
//   if (data.status === 200) return data.result
// })

export default handleActions({}, defaultState)
