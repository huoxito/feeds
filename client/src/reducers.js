import * as types from './actions'
import update from 'immutability-helper'

export const initialState = {
  user: null,
  userEvents: [],
  list: [],
  error: null,
  loading: true,
  enqueued: false,
  page: 1,
  lastLoad: new Date()
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ENQUEUE_REQUESTS_EVENTS:
      return {
        ...state,
        enqueued: true
      }
    case types.REQUEST_EVENTS:
      return {
        ...state,
        loading: true,
        enqueued: false
      }
    case types.RECEIVE_EVENTS:
      const prevList = state.list
      let list

      if (prevList.lenght > 0) {
        const ids = prevList.map(e => e.id)
        const newEvents = action.list.filter(e => ids.indexOf(e.id) === -1)
        list = update(state.list, { $unshift: newEvents })
      } else {
        list = action.list
      }

      return {
        ...state,
        list,
        loading: false
      }
    default:
      return state
  }
}
