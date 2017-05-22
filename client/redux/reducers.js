import { combineReducers } from 'redux'

import posts from './posts/index'
import comments from './posts/comments'

import auth from './auth'
import error from './error'
import profile from './profile'
import ratings from './ratings'

import nps from './admin/nps'

import programs from './user/programs'
import users from './admin/users'

export default combineReducers({
  nps,
  auth,
  error,
  profile,
  ratings,
  users,
  comments,
  posts: combineReducers({
    posts,
    comments
  }),
  user: combineReducers({
    programs
  })
})
