import * as types from './actions'
import update from 'immutability-helper'
import appLogo from './logo.png'

export const initialState = {
  starting: true,
  loading: true,
  enqueued: false,
  isAuthenticated: false,
  user: null,
  userEvents: [],
  list: [],
  lastLoad: new Date(),
  error: null,
  logo: appLogo,
  feedsName: 'Github Feeds',
  page: 1
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.RECEIVE_SESSION:
      return {
        ...state,
        starting: false,
        user: action.user,
        userEvents: action.userEvents,
        logo: action.user.avatar_url,
        feedsName: action.user.login,
        list: action.list,
        isAuthenticated: true
      }
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
      const feedsName = action.path || state.feedsName
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
        feedsName,
        loading: false
      }
    default:
      return state
  }
}
