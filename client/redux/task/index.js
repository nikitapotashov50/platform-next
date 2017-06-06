import { combineReducers } from 'redux'

import info from './task'
import reply from './reply'

export default combineReducers({
  info,
  reply
})
