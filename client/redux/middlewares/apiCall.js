import axios from 'axios'
import { apiError } from './apiError'

export const API_CONST = 'api/CALL'

const dispatchError = (data, dispatch, apiAction = null) => {
  dispatch(apiError({ message: `api call error`, ...data }))
  if (apiAction) dispatch({ type: apiAction, payload: data })
}

export const apiMiddleware = store => next => async ({ type, payload }) => {
  if (type === API_CONST) {
    let { method, params, url, options } = payload
    let [ startAction, successAction, errorAction ] = payload.actions
    method = method.toLowerCase()

    let result = {}
    if (startAction) store.dispatch({ type: startAction })
    try {
      if (method === 'get') result = await axios[method](url, { ...options, params })
      else result = await axios[method](url, params, options)

      if (result.data.status !== 200) dispatchError(result.data, store.dispatch, errorAction)
      else if (successAction) store.dispatch({ type: successAction, payload: result.data.result })
    } catch (e) {
      dispatchError({ status: 500, message: e }, store.dispatch, errorAction)
    }
  } else return next({ type, payload })
}
