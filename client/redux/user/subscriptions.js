import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

import { refresh } from '../auth'

let defaultState = []

const removeElement = (array, el) => {
  let index = array.indexOf(el)
  if (index > -1) array.splice(index, 1)
  return array
}

export const subscribeToUser = createAction('auth/SUBSCRIBE_TO_USER', async id => {
  let { status } = await axios.post('/api/mongo/me/interact/subscribe', { id }, { withCredentials: true })
  if (status === 200) return { id }
  return {}
})

export const unsubscribeFromUser = createAction('auth/UNSUBSCRIBE_FROM_USER', async id => {
  let { status } = await axios.put('/api/mongo/me/interact/subscribe', { id }, { withCredentials: true })
  if (status === 200) return { id }
  return {}
})

// reducer
export default handleActions({
  [refresh]: (state, { payload = {} }) => (payload.subscriptions || []),
  [subscribeToUser]: (state, { payload = {} }) => (payload.id ? [ ...state, payload.id ] : [ ...state ]),
  [unsubscribeFromUser]: (state, { payload = {} }) => ([ ...removeElement(state, payload.id) ])
}, defaultState)
