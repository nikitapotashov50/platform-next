// import thunk from 'redux-thunk'
import { createStore, combineReducers } from 'redux'

// reducers
import auth from './auth'
import access from './error'
import profile from './profile'

// default reducer
const exampleInitialState = {}
const index = (state = exampleInitialState, action) => {
  switch (action.type) {
    default: return state
  }
}

// combine reducers
let combinedReducer = combineReducers({
  auth,
  access,
  profile,
  index
})

export default (initialState = exampleInitialState) => {
  return createStore(combinedReducer, initialState)
}
