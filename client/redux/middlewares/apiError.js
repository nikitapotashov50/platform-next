import { createAction } from 'redux-actions'
import { dismissError, dispatchError } from '../error'

export const API_ERROR = 'error/API_ERROR'

export const apiError = createAction(API_ERROR, ({ message, status }) => ({ message, status }))

export const errorMiddleware = store => next => async ({ type, payload }) => {
  if (type === API_ERROR) {
    console.log('error dispatcher', payload)
    store.dispatch(dispatchError(payload))
    setTimeout(() => {
      store.dispatch(dismissError())
    }, 5000)
  } else return next({ type, payload })
}
