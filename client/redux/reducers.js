import { combineReducers } from 'redux'

import posts from './posts/index'
import comments from './posts/comments'

import likes from './likes'

import auth from './auth'
import error from './error'
import profile from './profile'
import ratings from './ratings'
import chat from './chat'

import nps from './admin/nps'

import programs from './user/programs'
import subscriptions from './user/subscriptions'

import users from './admin/users'

export default combineReducers({
  nps,
  auth,
  error,
  profile,
  ratings,
  users,
  // likes
  likes,
  // posts & comments
  posts: combineReducers({
    posts,
    comments
  }),
  // session user data
  user: combineReducers({
    programs,
    subscriptions
  }),
  chat
})
