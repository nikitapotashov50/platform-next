import { combineReducers } from 'redux'

import posts from './posts/index'
import comments from './posts/comments'

import likes from './likes'

import auth from './auth'
import error from './error'
import profile from './profile'
import ratings from './ratings'

import nps from './admin/nps'

import info from './user/info'
import programs from './user/programs'
import subscriptions from './user/subscriptions'

import taskItems from './tasks'
import task from './task'

import users from './users'

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
    info,
    programs,
    subscriptions
  }),
  tasks: combineReducers({
    items: taskItems
  }),
  task
})
