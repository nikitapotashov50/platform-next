import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

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
  subscriptions: [],
  blackList: [],
  cookieExists: false
}

// action creators
export const auth = createAction('auth/LOGIN', (user, isRestored = false) => ({ ...user, isRestored }))
export const logout = createAction('auth/LOGOUT')
export const cookieExists = createAction('auth/cookieExists')

//
export const updateInfo = createAction('auth/UPDATE_INFO')

// interactions
export const subscribeToUser = createAction('auth/SUBSCRIBE_TO_USER', async id => {
  let { status } = await axios.post('/api/me/interact/subscribe', { id }, { withCredentials: true })
  if (status === 200) return { id }
  return {}
})

export const unsubscribeFromUser = createAction('auth/UNSUBSCRIBE_FROM_USER', async id => {
  let { status } = await axios.put('/api/me/interact/subscribe', { id }, { withCredentials: true })
  if (status === 200) return { id }
  return {}
})

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
  [auth]: (state, { payload }) => {
    let subs = []
    if (payload.subscriptions) {
      payload.subscriptions.map(el => {
        subs.push(el.id)
      })
    }

    return {
      ...state,
      user: payload.user,
      blackList: payload.blackList,
      subscriptions: subs,
      isLogged: true,
      cookieExists: payload.isRestored
    }
  },
  [logout]: (state, action) => ({
    ...defaultState
  }),
  [cookieExists]: state => ({
    ...state,
    cookieExists: true
  }),
  //
  [updateInfo]: (state, { payload }) => ({
    ...state,
    user: {
      ...state.user,
      ...payload
    }
  }),
  //
  [subscribeToUser]: (state, { payload }) => ({
    ...state,
    subscriptions: payload.id ? [ ...state.subscriptions, payload.id ] : [ ...state.subscriptions ]
  }),
  [unsubscribeFromUser]: (state, { payload }) => ({
    ...state,
    subscriptions: [ ...removeElement(state.subscriptions, payload.id) ]
  }),
  [addToBlackList]: (state, { payload }) => ({
    ...state,
    blackList: [ ...state.blackList, payload.id ]
  }),
  [removeFromBlackList]: (state, { payload }) => ({
    ...state,
    subscriptions: [ ...removeElement(state.blackList, payload.id) ]
  })
}, defaultState)
