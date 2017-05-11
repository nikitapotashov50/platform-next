import { handleActions, createAction } from 'redux-actions'

// default state
let defaultState = {
  user: null,
  isLogged: false
}

// action creators
export const auth = createAction('auth/LOGIN', async user => ({ user }))
export const logout = createAction('auth/LOGOUT')

// reducer
export default handleActions({
  [auth]: (state, action) => ({
    ...state,
    user: action.payload.user,
    isLogged: true
  }),
  [logout]: (state, action) => ({
    ...state,
    user: null,
    isLogged: false
  })
}, defaultState)
