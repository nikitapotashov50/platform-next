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

import info from './user/info'
import programs from './user/programs'
import subscriptions from './user/subscriptions'

import taskItems from './tasks'
import task from './task'

import admin from './admin'
import users from './users'
import volunteer from './volunteer'
import feedback from './feedback'

export default asyncReducers => combineReducers({
  nps,
  auth,
  error,
  profile,
  ratings,
  users,
  // likes
  likes,
  //
  admin,
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
  chat,
  tasks: combineReducers({
    items: taskItems
  }),
  task,
  volunteer,
  feedback,
  ...asyncReducers
})
