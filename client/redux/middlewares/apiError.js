import { createAction } from 'redux-actions'
import { dismissError, dispatchError } from '../error'

export const API_ERROR = 'error/API_ERROR'

export const apiError = createAction(API_ERROR, ({ message, status, initial }) => ({ message, status, initial }))

export const errorMiddleware = store => next => async ({ type, payload }) => {
  if (type === API_ERROR) {
    store.dispatch(dispatchError(payload))
    console.log(type, payload)
    setTimeout(() => {
      store.dispatch(dismissError())
    }, 5000)
  } else next({ type, payload })
}
