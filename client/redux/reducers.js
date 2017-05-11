import { combineReducers } from 'redux'

import posts from './posts'
import auth from './auth'
import error from './error'
import profile from './profile'

export default combineReducers({
  auth,
  error,
  posts,
  profile
})
