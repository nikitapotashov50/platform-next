import { combineEpics, createEpicMiddleware } from 'redux-observable'

import { getNpsEpic } from './admin/npsEpic'

export default createEpicMiddleware(combineEpics(
  getNpsEpic
))
