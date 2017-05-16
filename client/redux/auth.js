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
  blackList: []
}

// action creators
export const auth = createAction('auth/LOGIN')
export const logout = createAction('auth/LOGOUT')

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
  [auth]: (state, action) => ({
    ...state,
    user: action.payload.user,
    blackList: action.payload.blackList,
    subscriptions: action.payload.subscriptions,
    currentProgram: action.payload.programs ? action.payload.programs[0].id : null,
    isLogged: true
  }),
  [logout]: (state, action) => ({
    ...defaultState
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
