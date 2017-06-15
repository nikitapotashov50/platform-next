import { handleActions, createAction } from 'redux-actions'

import { API_CONST } from '../../middlewares/apiCall'

export const userAcitons = {
  FETCH_START: 'entities/USERS_FETCH_START',
  FETCH_SUCCESS: 'entities/USERS_FETCH_SUCCESS',
  FETCH_FAIL: 'entities/USERS_FETCH_FAIL'
}

export const apiCall = createAction(API_CONST, (params = {}, options = {}) => ({
  params,
  options,
  url: `/api/mongo/users/list`,
  method: 'get',
  actions: userAcitons
})
