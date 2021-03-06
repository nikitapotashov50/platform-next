import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

import { updateInfo } from './user/info'

// util
const removeElement = (array, el) => {
  let index = array.indexOf(el)
  if (index > -1) array.splice(index, 1)
  return array
}

// default state
let defaultState = {
  user: null,
  isLogged: false,
  goal: {},
  blackList: [],
  cookieExists: false
}

// action creators
export const auth = createAction('auth/LOGIN', (user, isRestored = false) => ({ ...user, isRestored }))
export const logout = createAction('auth/LOGOUT')
export const cookieExists = createAction('auth/cookieExists')

//
export const refresh = createAction('auth/REFRESH', async (userId, serverPath = '') => {
  let { data } = await axios.post(serverPath + '/api/auth/refresh', { userId })
  return data.result
})

// interactions
export const addToBlackList = createAction('auth/BLACK_LIST_ADD', async id => {
  let { status } = await axios.post('/api/me/interact/block', { id }, { withCredentials: true })
  if (status === 200) return { id }
  return {}
})

export const removeFromBlackList = createAction('auth/BLACK_LIST_REMOVE', async id => {
  let { status } = await axios.put('/api/me/interact/block', { id }, { withCredentials: true })
  if (status === 200) return { id }
  return {}
})

// reducer
export default handleActions({
  [auth]: (state, { payload }) => ({
    ...state,
    goal: payload.goal || {},
    user: payload.user,
    blackList: payload.blackList,
    isLogged: true,
    cookieExists: payload.isRestored
  }),
  [logout]: (state, action) => ({
    ...defaultState
  }),
  [cookieExists]: (state, { payload = true }) => ({
    ...state,
    cookieExists: payload
  }),
  //
  [addToBlackList]: (state, { payload }) => ({
    ...state,
    blackList: [ ...state.blackList, payload.id ]
  }),
  [removeFromBlackList]: (state, { payload }) => ({
    ...state,
    subscriptions: [ ...removeElement(state.blackList, payload.id) ]
  }),
  //
  [updateInfo]: (state, { payload }) => ({
    ...state,
    user: {
      ...state.user,
      ...(payload.user || {})
    }
  })
}, defaultState)
