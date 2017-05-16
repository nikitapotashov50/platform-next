import { combineReducers } from 'redux'

import posts from './posts'
import auth from './auth'
import error from './error'
import profile from './profile'

import nps from './admin/nps'

import programs from './user/programs'

export default combineReducers({
  nps,
  auth,
  error,
  posts,
  profile,
  user: combineReducers({
    programs
  })
})
