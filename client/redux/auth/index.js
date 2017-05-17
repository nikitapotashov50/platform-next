// import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

//
import { auth, logout } from '../auth'

// default state
let defaultState = {
  isLogged: false,
  isCookieExissts: false,
  isLoggedOut: true,
  isRestored: false
}

//
export const setCookieExists = createAction('auth/SET_COOKIE_EXISTS')

// reducer
export default handleActions({
  [auth]: state => ({
    ...state,
    isLogged: true
  }),
  [logout]: state => ({
    ...state,
    isLogged: false
  })
}, defaultState)
