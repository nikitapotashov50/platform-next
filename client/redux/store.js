import { createStore } from 'redux'

const exampleInitialState = {
  count: 0
}

export const actionTypes = {
  AUTH: 'AUTH'
}

// REDUCERS
export const reducer = (state = exampleInitialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH:
      return Object.assign({}, state, {
        user: {
          id: 1,
          admin: false,
          name: 'Лол'
        }
      })
    default: return state
  }
}

// ACTIONS
export const auth = user => {
  return { type: actionTypes.AUTH }
}

export const initStore = (initialState = exampleInitialState) => {
  return createStore(reducer, initialState)
}
