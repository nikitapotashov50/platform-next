import axios from 'axios'
import { apiError } from './apiError'

export const API_CONST = 'api/CALL'

export const apiMiddleware = store => next => async ({ type, payload }) => {
  let result = {}

  if (type === API_CONST) {
    let { method, params, url, options } = payload
    let [ startAction, successAction, errorAction ] = payload.actions
    method = method.toLowerCase()

    let prefix = ''
    if (options && options.headers) prefix = BACKEND_URL

    try {
      if (startAction) store.dispatch({ type: startAction })
      if (method === 'get') result = await axios[method](prefix + url, { ...options, params })
      else result = await axios[method](prefix + url, params, options)

      if (result.data.status !== 200) {
        store.dispatch(apiError({ message: `api call error`, ...result.data, initial: payload }))
        if (errorAction) next({ type: errorAction, payload: result.data })
      } else if (successAction) next({ type: successAction, payload: result.data.result })
    } catch (e) {
      store.dispatch(apiError({ status: 500, message: e, initial: payload }))
      if (errorAction) next({ type: errorAction, payload: { status: 500, message: e } })
    }
  } else next({ type, payload })

  return type
}
