// default state
let defaultState = {
  user: null,
  isLogged: false
}

// actions
const LOGIN = 'auth/LOGIN'
const LOGOUT = 'auth/LOGOUT'

// action creators
export const auth = user => ({
  type: LOGIN,
  payload: { user }
})

export const logout = () => ({
  type: LOGOUT
})

// reducer
export default (state = defaultState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload.user,
        isLogged: true
      }
    case LOGOUT:
      return {
        ...state,
        user: null,
        isLogged: false
      }
    default: return state
  }
}
